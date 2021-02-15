import re, os

def deleteMatchFiles(directory, starts="", ends=""):
    '''
    按特定要求删除某路径下的匹配文件，如果starts和ends都不填写，则默认删除该目录下所有文件
    '''
    for path, dir_list, file_list in os.walk(directory):
        for fi in file_list:
            if fi.startswith(starts) and fi.endswith(ends): # "table9.csv".startswith("") 为 True
                os.remove(os.path.join(directory, fi))


def execScript(data_path, script_name, Rscript_path = r"D:\tool\R-4.0.3\bin\Rscript"):
    '''
    执行数据清洗脚本，对于每一步清洗操作，都会保存这一个状态下的table，同时保存所有清洗过程的列在一个文件内
    Return:
        original_codes: 源脚本代码, 每个元素对应一行代码
        col_states：字典：key为行号，value为列；如果该行结果为table，则记录table的所有列
        group_states: 字典：key为行号，value为分组的列：如果该行结果存在分组，则记录分组的列
    '''
    original_cwd = os.getcwd() # 查看当前工作目录
    os.chdir(os.path.join(os.getcwd(), data_path)) # 修改当前工作目录  os.path.join(os.getcwd(),script_name)
    
    script_base_name = os.path.splitext(script_name)[0]
    script_exec_name = script_base_name + "_exec.txt"
    
    original_codes = []  # 源脚本代码, 每个元素对应一行代码，行号从1开始
    codes = ""
    p = re.compile("\s*(.+?)\s*(=|<-).+[(]")
    
    deleteMatchFiles("./", starts="table", ends=".csv")
    deleteMatchFiles("./", ends="_exec.txt")
    if os.path.exists("colnames.txt"):
        os.remove("colnames.txt")
    
    with open(script_name, "r") as fp:
        line_num = 0
        for line in fp.readlines():
            line_num += 1
            codes += line
            original_codes.append(line.strip("\n"))
            match_r = p.findall(line)
            if len(match_r) == 0:
                if codes[-1] != '\n':
                    codes += '\n'
            else:
                if codes[-1] != '\n':
                    codes += '\n'
                codes += \
'''if (is.data.frame({value})) {{
        write(paste(append(colnames({value}), {line_num}, after = 0), collapse=','), "colnames.txt", append=T)
        write.table({value}, file="table{line_num}.csv", sep=",", quote=FALSE, append=FALSE, na="NA", row.names=FALSE)
        if (is.grouped_df({value})) {{
            write(paste(append(group_vars({value}), "group{line_num}", after = 0), collapse=','), "colnames.txt", append=T)
        }}
    }}\n'''.format(value=match_r[0][0],line_num=line_num)

    with open(script_exec_name, "w", ) as fp:
        fp.write(codes)
        
    os.system(Rscript_path + " " + script_exec_name)
    
    col_states = {}  # key对应代码的行号，value对应此行代码执行完之后的table中的列
    group_states = {} # key为行号，value为分组的列
    with open("colnames.txt", "r", ) as fp:
        for line in fp.readlines():
            line = line.strip("\n")
            states = line.split(',')
            if states[0].startswith("group"):
                group_states[int(states[0][5:])] = states[1:]
            else:
                col_states[int(states[0])] = states[1:]
    
    os.chdir(original_cwd) # 修改回原来的工作目录
    return original_codes, col_states, group_states


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


def parseCondition(con_str):
    '''
    con_str: 原始条件字符串
    return：返回解析出包含各个名称的set
            如 "mass > mean(mass, na.rm = TRUE)" 解析成 ("mass", "mean", "na.rm", "TRUE")
    '''
    con_names = set()
    name = ''
    for i in con_str:
        if i in "()><=!&|,+-/*":
            if name:
                con_names.add(remove_quote(name))
            name = ''
        else:
            name += i
    if name:
        con_names.add(remove_quote(name))
    
    return con_names


def remove_quote(params):
    '''
    先取出最外层的空格，然后去除参数列表中的最外层引号
    params 既可以是一个list，也可以是字符串
    若是list则返回一个list，若是字符串，也返回一个字符串
    '''
    if type(params) == str:
        params = params.strip()
        if params[0] in ('"', "'", "`"):
            return params[1:-1]
        else:
            return params
        
    param_list_new = []
    for i in params:
        i = i.strip()
        if i[0] in ('"', "'", "`"):
            param_list_new.append(i[1:-1])
        else:
            param_list_new.append(i)
    return param_list_new


def generate_transform_specs(data_path, script_name):
    # data_path = r"E:\other\notebook\transformers\research\parameter_glyph\code5"
    # script_name = "code5.txt" # "code5_test.txt"
    
    original_codes = [
        '''A = read.table(file = "sd.csv", "sdf.sss")''',
        '''B <- separate(data=  A, T, into=c('ha', 'G'))''',
        '''B = filter(B, P>'rT')''',
        '''C <- select(B, 4,1,2,3, 5)''',
#         '''D = gather(data=B, key="FF", `ssdf`, T, P)'''
#         '''D = spread(C, key="T", value=Channel)'''
#         '''D = summarise(C, ID=sum(ID), P=sd(P), .groups = NULL)'''
#         '''D = unite(B, "z", x,y, remove = FALSE)'''
#         '''D = left_join(x=A, B, by = c("first",`third`))'''
#         '''D = mutate(C, E=2*T+P, .keep="unused")'''
        '''D = arrange(B, desc(`Channel`))'''
    ]
    col_states = {1: ['ID', 'T', 'P.1', 'P.2', 'Q.1'],
                 2: ['ID', 'T', 'MORPH394', 'P'],
                 3: ['ID', 'T', 'MORPH469', 'Channel', 'P'],
                 4: ['ID', 'T', 'Channel', 'P'],
                 5: ['ID', 'T', 'Channel', 'P'],
                 6: ['ID', 'Channel', 'T', 'P']}
    
    group_states = {4: 'T'}
    
    original_codes, col_states, group_states = execScript(data_path, script_name)

    
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
    var2table = {} # 用来记录变量对应的table file名称
    var2num = lambda var: int(p_match_num.findall(var2table[var])[0]) # 根据变量找到对应的行号
    line_num = 0  # script的行号，从1开始
    

    # var2table = {"A": "table1.csv", "B": "table2.csv", "C": "table3.csv", "D": "table4.csv", "E": "table5.csv", "F": "table6.csv"}
    

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
            if params.get('file'):
                file = params.get('file')
            else:
                file = params['none'][0] # 无名参数列表中的第一个值为加载的文件名
            specs["operation_rule"] = 'Load: ' + file
            
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func in ('data.frame', 'tibble'):
            specs["type"] = 'create_tables'
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            specs["operation_rule"] = 'Create Manually'
            
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func == 'separate_rows':
            specs["type"] = 'separate_rows'
            pi = 0
            if params.get('data'):
                specs["input_table_name"] = params.get('data')
            else:
                specs["input_table_name"] = params['none'][pi]
                pi += 1
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            specs["input_explict_col"] = remove_quote(params["none"][pi:])
            if params.get('sep'):
                specs["operation_rule"] = 'Separate Row: ' + params["sep"]
            else:
                specs["operation_rule"] = '''Separate Row: "[^[:alnum:].]+"'''
            
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func == 'filter':
            condition = r[3].replace(params['none'][0],"").strip().strip(",").strip()
            
            specs["type"] = 'delete_rows_filter'
            specs["input_table_name"] = params['none'][0]
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            specs["input_explict_col"] = [i for i in col_states[line_num] if i in parseCondition(condition)]
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
                specs["input_explict_col"].append(params.get('col'))
            else:
                specs["input_explict_col"].append(params['none'][pi])
                pi += 1
            specs["input_explict_col"] = remove_quote(specs["input_explict_col"])
            if params.get('into'):
                if params.get('into').startswith("c("):
                    specs["output_explict_col"] = remove_quote(p_match_c.findall(params.get('into'))[0].strip().split(','))
            else:
                if params['none'][pi].startswith("c("):
                    specs["output_explict_col"] = remove_quote(p_match_c.findall(params['none'][pi])[0].strip().split(','))
                pi += 1
            if params.get('sep'):
                specs["operation_rule"] = "Separate Column: " + params.get('sep')
            else:
                specs["operation_rule"] = '''Separate Column: "[^[:alnum:]]+"'''
            
            var2table[output_tbl] = specs["output_table_file"]
        
        elif func == 'gather':
            specs["type"] = "transform_tables_fold"
            pi = 0
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
                 
        elif func == 'spread':
            specs["type"] = "transform_tables_unfold"
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
            if params.get('key'):
                specs["input_explict_col"].append(params.get('key'))
            else:
                specs["input_explict_col"].append(params['none'][pi])
                pi += 1
            if params.get('value'):
                specs["input_explict_col"].append(params.get('value'))
            else:
                specs["input_explict_col"].append(params['none'][pi])
                pi += 1
            specs["input_explict_col"] = remove_quote(specs["input_explict_col"])
            specs["operation_rule"] = 'Unfold'
            
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
            elif len(keep_col) < len(col_states[var2num(specs["input_table_name"])]):
                specs["type"] = 'delete_columns_select_keep'
                specs["input_explict_col"] = keep_col
                specs["operation_rule"] = 'Keep Column: ' + ','.join(keep_col)
            else:
                specs["type"] = 'transform_tables_rearrange'
                specs["input_explict_col"] = keep_col
                specs["operation_rule"] = 'Rearrange Column'
                
            var2table[output_tbl] = specs["output_table_file"]
        
        elif func in ("summarise", "summarize"):
            specs["type"] = "combine_rows_summarize"
            specs["input_table_name"] = params['none'][0]
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            specs["output_explict_col"] = []
            input_line_num = var2num(specs["input_table_name"])
            tmp = set()
            rule = []
            for pk, pv in params.items():
                pk = remove_quote(pk)
                if pk == 'none' or pk not in col_states[line_num]:
                    continue
                rule.append("%s=%s" % (pk, pv))
                specs["output_explict_col"].append(pk)
                tmp = tmp.union(set([i for i in col_states[input_line_num] if i in parseCondition(pv)]))
            specs["input_explict_col"] = list(tmp)
            if group_states.get(input_line_num):
                specs["input_implict_col"] = [group_states[input_line_num][0]]
                specs["operation_rule"] = "Group:%s, Summarize:%s" % (specs["input_implict_col"][0], ",".join(rule))
            else:
                specs["operation_rule"] = "Summarize:" + ",".join(rule)
                 
            var2table[output_tbl] = specs["output_table_file"]
        
        elif func == "unite":
            specs["type"] = "combine_columns_merge"
            pi = 0
            if params.get('data'):
                specs["input_table_name"] = params.get('data')
            else:
                specs["input_table_name"] = params['none'][pi]
                pi += 1
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            if params.get('col'):
                specs["output_explict_col"] = [remove_quote(params.get('col'))]
            else:
                specs["output_explict_col"] = [remove_quote(params['none'][pi])]
                pi += 1
            specs["input_explict_col"] = []
            for i in range(pi, len(params['none'])):
                specs["input_explict_col"].append(remove_quote(params['none'][i]))
            if params.get('sep'):
                specs["operation_rule"] = "Merge: '%s'" % params['sep']
            else:
                specs["operation_rule"] = "Merge: '_'"
                
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func.endswith("_join"):
            specs["type"] = "combine_tables_" + func  
            specs["input_table_name"] = []
            pi = 0
            if params.get('x'):
                specs["input_table_name"].append(params['x'])
            else:
                specs["input_table_name"].append(params['none'][pi])
                pi += 1
            if params.get('y'):
                specs["input_table_name"].append(params['y'])
            else:
                specs["input_table_name"].append(params['none'][pi])
                pi += 1
            specs["input_table_file"] = [var2table[specs["input_table_name"][0]], var2table[specs["input_table_name"][1]]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            # 暂时不支持 by=c("A"="B") 的这种情况
            if params.get('by'):
                if params['by'].startswith("c("):
                    specs["input_explict_col"] = remove_quote(remove_quote(p_match_c.findall(params['by'])[0].strip().split(',')))
                else:
                    specs["input_explict_col"] = [remove_quote(params['by'])]
            elif pi < len(params['none']):
                if params['none'][pi].startswith("c("):
                    specs["input_explict_col"] = remove_quote(remove_quote(p_match_c.findall(params['none'][pi])[0].strip().split(',')))
                else:
                    specs["input_explict_col"] = [remove_quote(params['none'][pi])]
            specs["operation_rule"] = func.replace("_", " ").title() # .title 将各单词的首字母大写
            
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func == 'mutate':
            # 暂时仅支持单个操作，即一个等于号
            specs["input_table_name"] = params['none'][0]
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            input_line_num = var2num(specs["input_table_name"])
            for pk, pv in params.items():
                pk = remove_quote(pk)
                if pk in ('none', ".keep", ".before", ".after"):
                    continue
                specs["output_explict_col"] = [pk]
                specs["input_explict_col"] = [i for i in col_states[input_line_num] if i in parseCondition(pv)]
                rule = "%s=%s" % (pk, pv)
                specs["operation_rule"] = "Mutate: " + rule
                if pk in col_states[input_line_num]:
                    if not params.get(".keep") or remove_quote(params.get(".keep")) == "all":
                        # 原来的列，且保留所有的列：transform
                        specs["type"] = 'transform_columns_mutate'
                    elif remove_quote(params.get(".keep")) == "unused":
                        # 原来的列，且删除使用的列：transform
                        if len(specs["input_explict_col"]) > 1:
                            specs["type"] = 'combine_columns_mutate'
                        else:
                            specs["type"] = 'transform_columns_mutate'   
                else:
                    if not params.get(".keep") or remove_quote(params.get(".keep")) == "all":
                        print(params.get(".keep"))
                        # 新增的列，且保留所有的列：create
                        specs["type"] = 'create_columns_mutate'
                    if remove_quote(params.get(".keep")) == "unused":
                        # 新增的列，且删除使用的列：transform
                        if len(specs["input_explict_col"]) > 1:
                            specs["type"] = 'combine_columns_mutate'
                        elif len(specs["input_explict_col"]) == 1:
                            specs["type"] = 'transform_columns_mutate'
                        else:
                            specs["type"] = 'create_columns_mutate'
                break
            
            var2table[output_tbl] = specs["output_table_file"]
            
        elif func == 'arrange':
            # 暂时先做单列排序
            specs["type"] = 'transform_tables_sort'
            specs["input_table_name"] = params['none'][0]
            specs["input_table_file"] = var2table[specs["input_table_name"]]
            specs["output_table_name"] = output_tbl
            specs["output_table_file"] = "table%d.csv" % line_num
            if params['none'][1].startswith("desc"):
                specs["input_explict_col"] = remove_quote(params['none'][1][5:-1])
            else:
                specs["input_explict_col"] = remove_quote(params['none'][1])
            specs["operation_rule"] = "Sort: " + params['none'][1]
            
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

        elif func in ('as.data.frame', "ungroup", "group_by"):
            pass

        else: # default, could also just omit condition or 'if True'
            print("The function, %s, is not currently supported!" % func)
            
        transform_specs.append(specs)
        
    return transform_specs
 