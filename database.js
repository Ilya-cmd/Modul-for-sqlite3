class DataBase {

    /**
     * 
     * @readonly
     */
    static sqlite3 = require('sqlite3').verbose();
    
    /**
    * 
    * @readonly
    */
   static database = new this.sqlite3.Database('./database/database.db');
    
    /**
     * 
     * @param {String[]} keys 
     * @param {String} table 
     * @param {String} condition 
     * @param {Boolean} some 
     * @param {Function()} callback 
     */
    static getData(keys, table, condition = '', some = true, callback = () => {}) {
        let sql = 'SELECT ';
        for (let i = 0; i < keys.length; i++) {
            sql += keys[i] === '*' ? keys[i] : '`' + keys[i] + '`';
            if (keys.length > i + 1)
                sql += ', ';
        }
        sql += ' FROM `' + table + '` ' + condition;
        
        if (some)
            this.database.all(sql, (err, rows) => {
                callback(err, rows);
            });
        else
            this.database.get(sql, (err, row) => {
                callback(err, row);
            });
    };
    
    /**
     * 
     * @param {String[]} keys 
     * @param {Values[]} values 
     * @param {String} table 
     * @param {String} condition 
     * @param {Function()} callback 
     */
    static updateData(keys, values, table, condition, callback = () => {}) {
        let sql = 'UPDATE `' + table + '` SET ';
        for (let i = 0; i < keys.length; i++) {
            sql += '`' + keys[i] + '` = ' + this.ToString(values[i]);
            if (keys.length > i + 1)
                sql += ', ';
        }
        sql += ' ' + condition;
        
        this.database.run(sql, (err) => {
            callback(err);
        });
    }
    
    /**
     * @param {String[]} keys
     * @param {String[]} values
     * @param {String} table 
     * @param {Function()} callback 
     */
    static insertData(keys, values, table, callback = () => {}) {
        let sql = 'INSERT INTO `' + table + '` (';
        for (let i = 0; i < keys.length; i++) {
            sql += '`' + keys[i] + '`';
            if (keys.length > i + 1)
                sql += ', ';
        }
        sql += ') VALUES (';
        for (let i = 0; i < values.length; i++) {
            sql += this.ToString(values[i]);
            if (values.length > i + 1)
                sql += ', ';
        }
        sql += ')';

        this.database.run(sql, (err) => {
            callback(err);
        });
    };

    /**
     * 
     * @param {String} table 
     * @param {String} condition 
     * @param {Function()} callback 
     */
    static deleteData(table, condition = '', callback = () => {}) {
        this.database.run('DELETE FROM `' + table + '` ' + condition, (err) => {
            callback(err);
        });
    }

    static ToString(value) {
        return typeof(value) === 'string' ? '\'' + value + '\'' : value;
    }
}

module.exports = {
    database: DataBase
};
