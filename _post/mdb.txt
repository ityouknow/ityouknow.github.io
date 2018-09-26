1.编译mongocxxdriver
A. 先下载cdriver编译
B.安装boostdev和cmake等
C.sudo cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local -DCMAKE_PREFIX_PATH=/usr/local -DLIBBSON_DIR=/usr/local -DBSONCXX_POLY_USE_BOOST=1
D. sudo make
期间可能要修改代码

测试代码test.cpp
#include <iostream>

#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/json.hpp>

#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>

int main(int, char**) {
    mongocxx::instance inst{};
    mongocxx::client conn{mongocxx::uri{}};

    bsoncxx::builder::stream::document document{};

    auto collection = conn["testdb"]["testcollection"];
    document << "hello" << "world";

    collection.insert_one(document.view());
    auto cursor = collection.find({});

    for (auto&& doc : cursor) {
        std::cout << bsoncxx::to_json(doc) << std::endl;
    }
}

编译方式
c++ --std=c++11 test.cpp $(pkg-config --cflags --libs libmongocxx) -Wl,-rpath,/usr/local/lib




2. mongo 编译
安装scons2.5.1，安装ssl,curl，pip2,python2.7
pip2 install -r buildscripts/requirements.txt
python2 buildscripts/scons.py all