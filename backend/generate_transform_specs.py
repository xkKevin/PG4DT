import re, os

def execScript(data_path, script_name, Rscript_path = r"D:\tool\R-4.0.3\bin\Rscript"):
    '''
    执行数据清洗脚本，对于每一步清洗操作，都会保存这一个状态下的table，同时保存所有清洗过程的列在一个文件内
    Return:
        original_codes: 源脚本代码, 每个元素对应一行代码
        col_states：每行代码对应的table中的列
    '''
    original_cwd = os.getcwd() # 查看当前工作目录
    os.chdir(os.path.join(os.getcwd(), data_path)) # 修改当前工作目录  os.path.join(os.getcwd(),script_name)
    
    script_base_name = os.path.splitext(script_name)[0]
    script_exec_name = script_base_name + "_exec.txt"
    
    original_codes = []  # 源脚本代码, 每个元素对应一行代码，行号从1开始
    col_states = {}  # key对应代码的行号，value对应此行代码执行完之后的table中的列
    codes = ""
    p = re.compile("\s*(.+?)\s*(=|<-).+[(]")
    
    with open(script_name, "r") as fp:
        line_num = 0
        flag = False
        for line in fp.readlines():
            line_num += 1
            codes += line
            original_codes.append(line.strip("\n"))
            match_r = p.findall(line)
            if len(match_r) == 0:
                if codes[-1] != '\n':
                    codes += '\n'
                if flag:
                    codes += '''write("", "colnames.txt", append=T)\n'''
                else:
                    codes += '''write("", "colnames.txt", append=F)\n'''
                    flag = True

            else:
                if codes[-1] != '\n':
                    codes += '\n'
                codes += '''if (is.data.frame({value})) {{
        write(paste(colnames({value}), collapse=','), "colnames.txt", append=T)
        write.table({value}, file="table{line_num}.csv", sep=",", quote=FALSE, append=FALSE, na="NA", row.names=FALSE)
    }} else {{write("", "colnames.txt", append=T)}}\n'''.format(value=match_r[0][0],line_num=line_num)

    with open(script_exec_name, "w", ) as fp:
        fp.write(codes)
        
    os.system(Rscript_path + " " + script_exec_name)
    
    with open("colnames.txt", "r", ) as fp:
        line_num = 0
        for line in fp.readlines():
            line_num += 1
            line = line.strip("\n")
            if line:
                col_states[line_num] = line.split(',')
    
    os.chdir(original_cwd) # 修改回原来的工作目录
    return original_codes, col_states


def parseArgs(param_str):
    '''
    param_str: 原始参数字符串
    return：返回对应的参数列表，分为无名参数和有名参数
    '''
    args = {"none": []}  
    arg = ""
    arg_name = ""
    bracket_flag = 0  # 只有当flag为0时，表示括号匹配结束
    quote_flag = True  # 当quote_flag为True时，表示引号匹配结束
    quote_str = ""
    for i in param_str:
        if bracket_flag == 0 and quote_flag and i == ",":
            if arg_name:
                args[arg_name] = arg.strip()
                arg_name = ""
            else:
                args['none'].append(arg.strip())
            arg = ""
            continue
        elif i == "=":
            arg_name = arg.strip()
            arg = ""
            continue
        elif i == "(":
            bracket_flag += 1
        elif i == ")":
            bracket_flag -= 1
        elif i in ['"', "'", "`"]: 
            if quote_flag: # 表示目前没有匹配到引号
                quote_flag = False
                quote_str = i  # 此时最外层的引号是 i，在没有匹配到第二个i前，里面可以存放任何字符
            elif i == quote_str: # 表示当前的字符 i 匹配到了最外层的引号 quote_str
                quote_flag = True
                quote_str == ""
        arg += i
    if arg_name:
        args[arg_name] = arg.strip()
    else:
        args['none'].append(arg.strip())
    return args


def remove_quote(param_list):
    '''
    去除参数列表中的最外层引号
    '''
    param_list_new = []
    for i in param_list:
        if i[0] in ('"', "'", "`"):
            param_list_new.append(i[1:-1])
        else:
            param_list_new.append(i)
    return param_list_new


def generate_transform_specs(data_path, script_name):
    # data_path = r"E:\other\notebook\transformers\research\parameter_glyph\code5"
    # script_name = "code5.txt" # "code5_test.txt"
    original_codes, col_states = execScript(data_path, script_name)

    p = re.compile("\s*(.+?)\s*(=|<-)\s*(.+?)\s*[(](.+)[)]")
    p_match_num = re.compile("table(.+)\.csv")
    p_match_c = re.compile("c\s*\((.+)\)")

    result = []
    for ci in original_codes:
        tmp = p.findall(ci)
        if len(tmp):
            result.append(tmp[0])
        else:
            result.append([])

    transform_specs = []
    var2table = {} # 用来记录变量对应的table名称
    var2num = lambda var: int(p_match_num.findall(var2table[var])[0]) # 根据变量找到对应的行号
    line_num = 0  # script的行号，从1开始

    for r in result:
        line_num += 1
        if not (r and col_states.get(line_num)):
            continue
        
        output_tbl = r[0]
        func = r[2]
        params = parseArgs(r[3])  # 得到无名参数none和有名参数的dict

        specs = {}
        
        if func == 'read.table':
            specs["type"] = 'create_tables'
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            specs["operation_rule"] = 'Load: ' + params['none'][0] # 无名参数列表中的第一个值为加载的文件名
            
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func in ('data.frame', 'tibble'):
            specs["type"] = 'create_tables'
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            specs["operation_rule"] = 'Create Manually'
            
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func == 'separate_rows':
            specs["type"] = 'separate_rows'
            specs["input_table_name"] = params['none'][0]
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            specs["input_explict_col"] = remove_quote(params["none"][1:])
            specs["operation_rule"] = 'Separate Row: ' + params["sep"]
            
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func == 'filter':
            condition = r[3].replace(specs["input_table_name"],"").strip().strip(",").strip()
            
            specs["type"] = 'delete_rows_filter'
            specs["input_table_name"] = params['none'][0]
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            specs["input_explict_col"] = remove_quote([i for i in col_states[line_num] if i in condition])
            specs["operation_rule"] = 'Filter: ' + condition
            
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func == 'separate':
            specs["type"] = 'separate_columns'
            pi = 0
            if params.get('data'):
                specs["input_table_name"] = params.get('data')
            else:
                specs["input_table_name"] = params['none'][pi]
                pi += 1
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            specs["input_explict_col"] = []
            specs["output_explict_col"] = []
            if params.get('col'):
                specs["input_explict_col"].append(params.get('key'))
            else:
                specs["input_explict_col"].append(params['none'][pi])
                pi += 1
            specs["input_explict_col"] = remove_quote(specs["input_explict_col"])
            if params.get('into'):
                if params.get('into').startswith("c("):
                    specs["output_explict_col"] = remove_quote(p_match_c.findall(params.get('into'))[0].strip().split(','))
            else:
                if params.get('into').startswith("c("):
                    specs["output_explict_col"] = remove_quote(p_match_c.findall(params['none'][pi])[0].strip().split(','))
                pi += 1
            if params.get('sep'):
                specs["operation_rule"] = "Separate Column: " + params.get('sep')
            else:
                specs["operation_rule"] = '''Separate Column: "[^[:alnum:]]+"'''
            
            var2table[output_tbl] = specs["output_table_file"]
        
        elif func == 'gather':
            pi = 0
            specs["type"] = "transform_tables_fold"
            if params.get('data'):
                specs["input_table_name"] = params.get('data')
            else:
                specs["input_table_name"] = params['none'][pi]
                pi += 1
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            specs["output_explict_col"] = []
            if params.get('key'):
                specs["output_explict_col"].append(params.get('key'))
            else:
                specs["output_explict_col"].append(params['none'][pi])
                pi += 1
            if params.get('value'):
                specs["output_explict_col"].append(params.get('value'))
            else:
                specs["output_explict_col"].append(params['none'][pi])
                pi += 1
            specs["output_explict_col"] = remove_quote(specs["output_explict_col"])
            remove_col = set()
            specs["input_explict_col"] = []
            for i in range(pi, len(params['none'])):
                if params['none'][i].startswith('-'):
                    remove_col.add(params['none'][i][1:])
                else:
                    specs["input_explict_col"].append(params['none'][i])
            if remove_col:
                remove_col = set(remove_quote(remove_col))
                specs["input_explict_col"] = list(set(col_states[var2num(specs["input_table_name"])]) - remove_col)
            specs["input_explict_col"] = remove_quote(specs["input_explict_col"])
            specs["operation_rule"] = 'Fold'
            
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func == "select":
            specs["input_table_name"] = params['none'][0]
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            remove_col = []
            keep_col = []
            for i in range(1, len(params['none'])):
                if params['none'][i].startswith('-'):
                    remove_col.append(params['none'][i][1:])
                else:
                    keep_col.append(params['none'][i])
            remove_col = remove_quote(remove_col)
            keep_col = remove_quote(keep_col)
            if remove_col:
                specs["type"] = 'delete_columns_select_remove'
                specs["input_explict_col"] = remove_col
                specs["operation_rule"] = 'Delete Column: ' + ','.join(remove_col)
            elif len(col_states[var2num(specs["output_table_name"])]) < len(col_states[var2num(specs["input_table_name"])]):
                specs["type"] = 'delete_columns_select_keep'
                specs["input_explict_col"] = keep_col
                specs["operation_rule"] = 'Keep Column: ' + ','.join(keep_col)
            else:
                specs["type"] = 'transform_tables_rearrange'
                specs["input_explict_col"] = keep_col
                specs["operation_rule"] = 'Rearrange Column'
                
            var2table[output_tbl] = specs["output_table_file"]

        # 13 combine tables
        elif func in ('rbind', "bind_rows"):
            specs["type"] = "extend"
            specs["output_tbl"] = output_tbl
            specs["input_tbls"], specs["other_args"] = getOtherArgs(params, ['.id', 'deparse.level'])
            print(specs)

        elif func in ('supplement'):
            print('supplement')

        elif func in ('inner_join'):
            specs["type"] = "match"
            specs["output_tbl"] = output_tbl
            specs["input_tbls"] = params
            print(specs)

        elif func in ('as.data.frame'):
            continue

        else: # default, could also just omit condition or 'if True'
            print("The function, %s, is not currently supported!" % func)
            
        transform_specs.append(specs)
        
    return transform_specs