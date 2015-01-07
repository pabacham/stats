'use strict';

var _ = require('lodash'),
    async = require('async');

module.exports = exports = function (schema) {

    schema.statics.getItem = function (options, done) {
        // Default expected options
        _.defaults(options, {
            args: null,
            fields: null
        });

        var filter = {
            deleted: false
        };

        if (typeof options.args === 'object') {
            _.extend(filter, options.args);
        } else {
            filter._id = options;
        }

        if (typeof options.fields === 'string') {
            options.fields = options.fields || {};
            if (options.populate) {
                this.findOne(filter, options.fields).populate(options.populate).exec(done);
            } else {
                this.findOne(filter, options.fields, done);
            }
        } else {
            if (options.populate) {
                this.findOne(filter).populate(options.populate).exec(done);
            } else {
                this.findOne(filter, done);
            }
        }
    };

    schema.statics.addItem = function (data, done) {
        var Model = this,
            item = new Model(data);

        item.save(done);
    };

    schema.statics.updateItem = function (_id, data, done) {
        this.findByIdAndUpdate(_id, data, done);
    };

    schema.statics.deleteItem = function (_id, done) {
        this.getItem(_id, function (err, item) {
            if (!item) {
                return done();
            }
            item.deleted = true;
            item.save(done);
        });
    };

    schema.statics.getList = function (options, done) {
        var Model = this,
            query;

        // Default expected options
        _.defaults(options, {
            filter: {},
            fields: null,
            population: null,
            sort: null,
            skip: 0,
            limit: 10
        });

        // If limit is null or <= 0, override its value to enforce a limited response
        if (!options.limit || options.limit < 0) {
            options.limit = 10;
        }

        // Enforce deleted filter
        _.assign(options.filter, {
            deleted: false
        });

        /*if (options.query) {
            filter = util.prepareSearch(options.query, this);
            _.assign(options.filter, filter);
        }*/

        query = Model.find(options.filter)
            .skip(+options.skip)
            .limit(+options.limit)
            .sort(options.sort);

        if (options.fields) {
            query = query.select(options.fields);
        }

        if (options.population) {
            query = query.populate(options.population);
        }

        async.parallel({
            count: function (next) {
                Model.count(options.filter, next);
            },
            data: function (next) {
                query.exec(next);
            }
        }, done);
    };
};
