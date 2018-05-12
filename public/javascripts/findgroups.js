function divideForGroups(nodes) {
    let groups = [];
    let top = [];
    nodes.forEach((node, i) => {
        node.relations = [];
        nodes.forEach(n => {
            if (n !== node) {
                let intersection = node.relatesTo.filter(x => n.relatesTo.includes(x));
                let perc = intersection.length / (node.relatesTo.length + n.relatesTo.length);
                node.relations.push({id: n.id, percent: perc});
            }
        });
        node.relations.sort(function (a, b) {
            if (a.percent < b.percent) {
                return 1;
            }
            if (a.percent > b.percent) {
                return -1;
            }
            return 0;
        });
    });
    let common = findCommonElements(nodes.map(node => node.relations.map(rel => rel.id)));
    console.log(JSON.stringify(common));
    nodes.forEach(node => {
        if (node.relations.length > 0) {
            node.relations = node.relations.filter(rel => !(rel.id in common));
            for (let i = 0; i < node.relations.length; i++) {
                if (!(node.relations[i].id in top)) {
                    top.push(node.relations[0].id);
                    i = node.relations.length;
                }
            }
        }
    });
    console.log(top);
    top.forEach(t => {
        let topnode = nodes.find(node => {
            return node.id === t;
        });
        let group = {id: groups.length, name: "Group #" + groups.length, topId: topnode.id};
        groups.push(group);
        topnode.groupId = group.id;
        topnode.groupName = group.name;
    });
    console.log(groups);
    nodes.forEach(node => {
        if (node.groupId === undefined && node.relations.length > 0) {
            let group = groups.find(group => group.topId === node.relations[0].id);
            if (group) {
                node.groupId = group.id;
                node.groupName = group.name;
            }
        }
    });
    return {
        nodes: nodes,
        groups: groups
    }
}


function findCommonElements(inArrays) {
    console.log(JSON.stringify(inArrays))
    if (typeof inArrays === "undefined") return undefined;
    if (typeof inArrays[0] === "undefined") return undefined;
console.log(JSON.stringify(_.intersection.apply(this, inArrays)))
    return _.intersection.apply(this, inArrays);
}