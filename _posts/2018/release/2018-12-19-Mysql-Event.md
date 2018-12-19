---
layout:     post
title:      Mysql-Event
category: mysql
tags: [mysql]
no-post-nav: true
excerpt: 创建存储过程和事件，解决就业超市首页最新招聘信息查询特别缓慢的问题
keywords: 原创
---

---

## 事件简介

&emsp;&emsp;事件是Mysql在相应的时刻调用的过程式数据库对象。一个事件可调用一次，也可周期性的调用，它由一个特定的线程来管理的，也就是所谓的[事件调度器]。

&emsp;&emsp;事件和触发器类似，都是在某些事情发生的时候启动。当数据库上启动一条语句的时候，触发器就启动了，而事件是根据调度事件来启动的。由于他们彼此相似，所以事件也称为临时性触发器。

&emsp;&emsp;事件取代了原先只能由操作系统的计划任务来执行的工作，而且MySQL的事件调度器可以精确到每秒钟执行一个任务，而操作系统的计划任务（如：Linux下的CRON或Windows下的任务计划）只能精确到每分钟执行一次。


---

## 事件的优缺点

### 优点
    一些对数据定时性操作不再依赖外部程序，而直接使用数据库本身提供的功能。
    可以实现每秒钟执行一个任务，这在一些对实时性要求较高的环境下就非常实用了。

### 缺点

    定时触发，不可以调用。

---

## e.g.

### 先创建存储过程

    DROP PROCEDURE IF EXISTS zxzpxx_procedure;
    CREATE PROCEDURE zxzpxx_procedure ()
    BEGIN
    INSERT INTO jycs_qzzp_zxzpxx(id, gwmc, zdyx, zgyx, zpdwmc, dwhy, gzdq, djsj) SELECT
        id, gwmc, zdyx, zgyx, zpdwmc, dwhy, gzdq, djsj
    FROM
        (
            SELECT
                zpgwb.zpgwid id,
                gwmc,
                zdyx, zgyx,
                daxxb.dwmc zpdwmc,
                dwhy,
                daxxb.jydxzqh gzdq,
                zpgwb.djsj
            FROM
                zyjsww_dw_zpgwb zpgwb,
                zyjsww_dw_djxxb djxxb,
                zyjsww_dw_daxxb daxxb,
                jycs_qzzp_dwjwdb dwjwdb,
                (
                    SELECT
                        c.zpgwid
                    FROM
                        zyjsww_dw_zpgwb c,
                        (
                            SELECT
                                d.dwdjid,
                                max(djsj) djsj
                            FROM
                                zyjsww_dw_zpgwb d
                            GROUP BY
                                d.dwdjid
                        ) b
                    WHERE
                        c.dwdjid = b.dwdjid
                    AND c.djsj = b.djsj
                    GROUP BY
                        c.dwdjid
                ) a
            WHERE
                zpgwb.dwdjid = djxxb.dwdjid
            AND djxxb.dwbh = daxxb.dwbh
            AND daxxb.dwbh = dwjwdb.dwbh
            AND a.zpgwid = zpgwb.zpgwid
            AND dwjwdb. STATUS = 0
        ) x
    WHERE
        NOT EXISTS (
            SELECT
                1
            FROM
                jycs_qzzp_zxzpxx zxzpxx
            WHERE
                zxzpxx.id = x.id
        );
    END;

### 创建事件

    SET GLOBAL event_scheduler = 1;
    DROP EVENT if exists zxzpxx_event;
    CREATE EVENT IF NOT EXISTS zxzpxx_event
    ON SCHEDULE EVERY 5 MINUTE STARTS '2018-11-11 11:11:11'
    ON COMPLETION PRESERVE
    DO CALL zxzpxx_procedure();

### 解释

    SET GLOBAL event_scheduler = 1, 数据库服务器重启，失效；
    可以通过在my.ini(Windows)或者my.cnf(linux中)中添加event_scheduler=1(on也可以)解决;
    ON COMPLETION [not] PRESERVE 表示事件执行之后不[不]删除事件（指定not时会删除）；
