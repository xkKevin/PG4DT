from flask import Flask, request, render_template, jsonify, send_from_directory
# from flask_cors import CORS  # 前端已经通过代理处理CORS了，因此后端不需要再开启
import generate_transform_specs as gts

# 当设置了某个路径为static_folder后，自动将最后一个文件夹设置为url的静态文件访问起始网址
# 如static_folder='../dist/static/data'，则 http://localhost/data/t.json 访问 ../dist/static/data/t.json文件
app = Flask(__name__, static_folder='../dist/static',
            template_folder='../dist')
# CORS(app, supports_credentials=True)  # 解决跨域问题，其实只有在开发时才有用

# app.jinja_env.variable_start_string = '[['
# app.jinja_env.variable_end_string = ']]'

data_path = "backend/data/"
script_file = "script_test.txt"

# 注意，以下两个输出结果不一样，此时程序中涉及到的路径皆以app.root_path为准
# print(os.getcwd()) # flask_vue
# print(app.root_path)  # flask_vue/backend

@app.route('/')
def index():
    # 由于前端html页面都被打包压缩，因此直接使用jinja模板来传参不可行，这样就要另开启一个接口
    return render_template('index.html') # render_template('index.html', language='r') 此种方法行不通


# 前端向后端获取scripts、table name等信息
@app.route('/getScriptData', methods=['GET'])
def getData():
    if request.method == "GET":
        script_content = request.args.get("script_content", "")  # POST请求用 request.form.get
        if script_content:
            language = request.args.get("language")
        else:
            with open(data_path + 'code5.txt', 'r', encoding='utf-8') as f:
                script_content = f.read() # 直接读取文件内容
            language = "r"
        return jsonify({'script_content': script_content, 'language': language})
    else:
        return jsonify({'error': "Not GET Request!"})


@app.route('/generate_transform_specs', methods=['GET'])
def generate_transform_specs():
    transform_specs = {}
    if request.method == "GET":
        script_content = request.args.get("script_content", "")  # POST请求用 request.form.get
        language = request.args.get("language", "r")
        with open(data_path + script_file, 'w', encoding='utf-8') as f:
            f.write(script_content)
        try:
            transform_specs = gts.generate_transform_specs(data_path, script_file)  # 判断是否有异常发生
        except Exception as e:
            return jsonify({'error_info': str(e)})   # 如果有异常的话，将异常信息返回给前端
    return jsonify({'transform_specs': transform_specs})
    transform_specs = [{
                        'type':'delete_rows_deduplicate',
                        'input_explict_col':['年龄','男'],
                        'input_table_file':'d1.csv',
                        'output_table_file':'d2.csv',
                        'operation_rule':'test'
                        }]


# 由于Flask只能开启一个static_folder，要想访问其他静态数据，则重新开启一个路由以专门访问数据
# Custom static data
@app.route('/data/<path:filename>')
def custom_static_folder(filename):
    # 因为当前flask运行的目录就在backend下，因此可以直接访问data/目录
    return send_from_directory("data/", filename) 


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
