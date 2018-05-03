$(document).ready(function () {
});

var contgr = {};
contgr.metadata = {};

var defaultFields = {
    id: "id",
    name: "name",
    description: "description",
    link: "link",
    relatesTo: "relatesTo",
    type: "type",
    group: "group",
    config: "config"
};

contgr.metadata.fields = defaultFields;

// hubsize, directed
contgr.options = {
    nodes: {
        shape: 'dot',
        scaling: {
            label: {
                min: 8,
                max: 20
            }
        }
    },
    layout: {
        hierarchical: {
            direction: "UD",
            sortMethod: "directed"
        }
    },
    // interaction: {dragNodes :false},
    physics: {
        enabled: false
    }
};

contgr.nodeFields = function (fields) {
    this.metadata.fields = Object.assign({}, defaultFields, fields);
    return this;
};

var typeObj = {
    id: 0,
    name: "",
    abstract: false
};

contgr.metadata.types = [];

contgr.metadata.typeFieldId = "id";

contgr.dataTypes = function (types, fieldId) {
    if (fieldId != null)
        this.metadata.typeFieldId = fieldId;
    types.forEach(function (type) {
        this.metadata.types.push(Object.assign({}, typeObj, type))
    }, this);
    return this;
};


// Builder

var defaultNode = {
    // fixed: true,
    value: 1
};

var nodes = [];
var edges = [];

contgr.groups = [];

contgr.buildData = function (...nodesArrays) {
    for (var i = 0; i < nodesArrays.length; i++) {
        nodesArrays[i].forEach(function (node) {
            var group = false;
            if (node[this.metadata.fields.type]){
                var type = this.metadata.types.filter(t => t[this.metadata.typeFieldId] === node[this.metadata.fields.type]);
                if (type && type["abstract"]){
                    group = true;
                }
            }
            if (group) {
                contgr.groups.push({
                    id: node[this.metadata.fields.id],
                    name: node[this.metadata.fields.name],
                    type: node[this.metadata.fields.type],
                    config: node[this.metadata.fields.config],
                })
            } else {
                nodes.push(Object.assign({}, defaultNode,
                    {
                        id: node[this.metadata.fields.id],
                        label: node[this.metadata.fields.name],
                        description: node[this.metadata.fields.description],
                        link: node[this.metadata.fields.link],
                        type: node[this.metadata.fields.type],
                        group: node[this.metadata.fields.group]
                    }
                ));
            }
        }, this)
    }
    for (var i = 0; i < nodesArrays.length; i++) {
        nodesArrays[i].forEach(function (node) {
            var value = 1;
            node[this.metadata.fields.relatesTo].forEach(function (relId) {
                var existing = edges.filter(edge => (edge.from === node[this.metadata.fields.id] && edge.to === relId
                    || edge.from === relId && edge.to === node[this.metadata.fields.id]));
                if (existing.length > 0) {
                    value++;
                    nodes.find(o => o.id === relId).value++;
                } else {
                    edges.push({
                        to: node[this.metadata.fields.id],
                        from: relId
                    });
                    value++;
                    var rel = nodes.find(o => o.id === relId);
                    if (rel) {
                        rel.value++;
                    }
                }
            }, this);
        }, this)
    }
    this.data = {
        nodes: nodes,
        edges: edges
    };
    return this;
};


// Draw

contgr.layout = function (hierarhy) {
    if (hierarhy.direction)
        this.options.layout.hierarchical.direction = hierarhy.direction;
    if (hierarhy.sortMethod)
        this.options.layout.hierarchical.sortMethod = hierarhy.sortMethod;
    return this;
};

contgr.draw = function (container) {
    this.graph = new vis.Network(container, this.data, this.options);
    var innerData = this;
    this.graph.on("doubleClick", function (params) {
        if (params.nodes){
            var node = innerData.data.nodes.find(node => node.id === params.nodes[0]);
            if (node) {
                var win = window.open(node.link, '_blank');
                win.focus();
            }
        }
    });
    return this;
};