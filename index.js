var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); //��������body
var app = express(); //nodejs��http������
//�������ݿ�
var mysql = require('mysql');
//����json���͵�body
app.use(bodyParser.json());
//����string����body
app.use(bodyParser.urlencoded({
    //��������ݲ���stringʱ��Ҫ�ĳ�true������undefined
    extended: false
}));
//���þ�̬�ļ���publicĿ¼
app.use(express.static(__dirname + '/public'));
//������get/post�����ύ�ģ�������
//���������    http://localhost/about
app.use("/about", function(req, res) {
    console.log("����");
    res.send("������get/post�����ύ�ģ�������");
});
//��̬�ļ�Ŀ¼
//http://localhost/public/images/bg.png
app.use('/view', express.static('view'));

app.get('/', function(req, res) {
    res.writeHead(302, {
        'Location': '/view/test.html'
            //add other headers here...
    });
    res.end();
});
////////////////////////////////////////////
//try to connect mysql
function makeConnect() {
    //ʵ�ֱ�������
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'chenxiaole',
        database: 'softwareproject'
    })
    return connection;
}
//ͨ��id��ȡͼƬ
app.get('/getImg', function(req, res) {
    var connection = makeConnect();
    var id = req.query.id;
    var sql = 'select imgPath from image where id=' + id + ';';
    console.log(sql);
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting:' + err.stack)
        }
        console.log('connected as id ' + connection.threadId);
    })
    connection.query(sql, function(error, results, fields) {
        if (error) throw error;
        /*console.log('The solution is:', results[0].imgPath);
        for (var p in results) {
            console.log("����һ����֪��η��ʵı�����");
            console.log(results[p].imgPath);
        }
        var fs = require("fs");
        var content = fs.readFileSync(results[0].imgPath, 'binary');
        res.send(new Buffer(content));*/
        console.log(results[0].imgPath);
        res.sendFile(results[0].imgPath, { root: __dirname });
        console.log("return img success!!!");
    });
    connection.end();
})

//��ȡ��ע����
app.get('/getData', function(req, res) {
    var connection = makeConnect();
    //var imgId = req.body.imgId;
    var imgId = 0;
    var sql = 'select * from imgmark where belong2img=' + imgId + ';';
    console.log(sql);
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting:' + err.stack)
        }
        console.log('connected as id ' + connection.threadId);
    })

    connection.query(sql, function(error, results, fields) {
        if (error) throw error;
        console.log('The solution is:', results);
        res.json(results);
    });
    connection.end();
})

//����ݸ�
app.post('/saveDraft', function(req, res) {
        var connection = makeConnect();
        var data = req.body;
        console.log(data);
        var index = req.body.index;
        console.log(data.index);
        //�����һ������		
        let query = connection.query('DELETE FROM imgmark where belong2img=?', [0], function(error, results, fields) {
            if (error) throw error;
        })
        console.log(query.sql);
        //������������
        if (index == 1) {
            for (var i = 0; i < index; i++) {
                let post = {
                    belong2img: 0,
                    nodex: req.body['x[]'],
                    nodey: req.body['y[]'],
                    width: req.body['width[]'],
                    height: req.body['height[]']
                };
                query = connection.query("INSERT INTO imgmark SET ?", post, function(error, results, fields) {
                    if (error) throw error;
                })
                console.log(query.sql);
            }
        } else {
            for (var i = 0; i < index; i++) {
                let post = {
                    belong2img: 0,
                    nodex: req.body['x[]'][i],
                    nodey: req.body['y[]'][i],
                    width: req.body['width[]'][i],
                    height: req.body['height[]'][i]
                };
                let query = connection.query("INSERT INTO imgmark SET ?", post, function(error, results, fields) {
                    if (error) throw error;
                })
                console.log(query.sql);
            }
        }
    })
    ////////////////////////////////////////////
app.listen(8081, function() {
    console.log("listening port 8081...");
})