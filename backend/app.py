from flask import Flask, render_template, jsonify
from flask_cors import CORS
import generate_transform_specs as gts

app = Flask(__name__, static_folder='./data',
            template_folder='../dist')
CORS(app, supports_credentials=True)  # 解决跨域问题


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/backendData', methods=['GET'])
def getTableData():
    backendData = "backendData_haha"
    return jsonify({'backendData': backendData})

@app.route('/generate_transform_specs', methods=['GET'])
def generate_transform_specs():
    transform_specs = gts.generate_transform_specs("backend/data/", "code5.txt")
    return jsonify({'transform_specs': transform_specs})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
