function divideForGroups(nodes) {
    console.log(nodes);
    let groups = [];
    let top = [];
    // let nodesPromise = findRelations(nodes);
    nodes.forEach((node, i) => {
        var relations = [];
        nodes.forEach(n => {
            if (n !== node) {
                let intersection = node.relatesTo.filter(x => n.relatesTo.includes(x));
                let perc = intersection.length / (node.relatesTo.length + n.relatesTo.length);
                relations.push({id: n.id, percent: perc});
                // node.relations = relations;
                console.log(relations)
                if (perc >= 0.5) {
                    if (node.groupId !== undefined) {
                        n.groupId = node.groupId;
                        n.groupName = node.groupName;
                        setRelated(n);
                    } else if (n.groupId !== undefined) {
                        node.groupId = n.groupId;
                        node.groupName = n.groupName;
                        setRelated(node);
                    } else {
                        let group = {id: groups.length, name: "Group #" + groups.length};
                        groups.push(group);
                        node.groupId = n.groupId = group.id;
                        node.groupName = n.groupName = group.name;
                        setRelated(node);
                        setRelated(n);
                    }
                } else if ((intersection.length / node.relatesTo.length) >= 0.5) {
                    if (n.groupId !== undefined) {
                        node.groupId = n.groupId;
                        node.groupName = n.groupName;
                        setRelated(node);
                    } else {
                        if (n.groupRelated !== undefined) {
                            n.groupRelated.push(node.id);
                        } else {
                            n.groupRelated = [node.id];
                        }
                    }
                } else if ((intersection.length / n.relatesTo.length) >= 0.5) {
                    if (node.groupId !== undefined) {
                        n.groupId = node.groupId;
                        n.groupName = node.groupName;
                        setRelated(n);
                    } else {
                        if (node.groupRelated !== undefined) {
                            node.groupRelated.push(n.id);
                        } else {
                            node.groupRelated = [n.id];
                        }
                    }
                }
            }
        });
        relations.sort(function (a, b) {
            if (a.percent < b.percent) {
                return 1;
            }
            if (a.percent > b.percent) {
                return -1;
            }
            return 0;
        });
        console.log(relations)
        nodes[i].relations = relations;
    });
    // nodesPromise.then(nodes => {
    console.log(nodes)
    // let common = findCommonElements(nodes.map(node => node.relations.map(rel => rel.id)));
    // console.log(common);
    // nodes.forEach(node => {
    //     if (node.relations.length > 0) {
    //         node.relations = node.relations.filter(rel => rel.id in common);
    //         for (let i = 0; i < node.relations.length; i++) {
    //             if (!(node.relations[i].id in top)) {
    //                 top.push(node.relations[0].id);
    //                 i = node.relations.length;
    //             }
    //         }
    //     }
    // });
    // console.log(top);
    // top.forEach(t => {
    //     let topnode = nodes.find(node => {
    //         return node.id === t;
    //     });
    //     let group = {id: groups.length, name: "Group #" + groups.length, topId: topnode.id};
    //     groups.push(group);
    //     topnode.groupId = group.id;
    //     topnode.groupName = group.name;
    // });
    // console.log(groups);
    // nodes.forEach(node => {
    //     if (node.groupId === undefined && node.relations.length > 0) {
    //         let group = groups.find(group => group.topId === node.relations[0].id);
    //         if (group) {
    //             node.groupId = group.id;
    //             node.groupName = group.name;
    //         }
    //     }
    // });
    return {
        nodes: nodes,
        groups: groups
    }
    // });
}

function setRelated(node) {
    if (node.groupRelated !== undefined) {
        node.groupRelated.forEach(n => {
            n.groupId = node.groupId;
            n.groupName = node.groupName;
        });
        delete node.groupRelated;
    }
}

function findRelations(nodes) {
    return new Promise((resolve, reject) => {
        let newnodes = nodes.map(node => {
            var relations = [];
            nodes.forEach(n => {
                if (n !== node) {
                    let intersection = node.relatesTo.filter(x => n.relatesTo.includes(x));
                    let perc = intersection.length / (node.relatesTo.length + n.relatesTo.length);
                    relations.push({id: n.id, percent: perc});
                    // node.relations = relations;
                    console.log(relations)
                    // if (pers >= 0.5) {
                    //     if (node.groupId !== undefined) {
                    //         n.groupId = node.groupId;
                    //         n.groupName = node.groupName;
                    //         setRelated(n);
                    //     } else if (n.groupId !== undefined) {
                    //         node.groupId = n.groupId;
                    //         node.groupName = n.groupName;
                    //         setRelated(node);
                    //     } else {
                    //         let group = {id: groups.length, name: "Group #" + groups.length};
                    //         groups.push(group);
                    //         node.groupId = n.groupId = group.id;
                    //         node.groupName = n.groupName = group.name;
                    //         setRelated(node);
                    //         setRelated(n);
                    //     }
                    // } else if ((intersection.length / node.relatesTo.length) >= 0.5) {
                    //     if (n.groupId !== undefined) {
                    //         node.groupId = n.groupId;
                    //         node.groupName = n.groupName;
                    //         setRelated(node);
                    //     } else {
                    //         if (n.groupRelated !== undefined) {
                    //             n.groupRelated.push(node.id);
                    //         } else {
                    //             n.groupRelated = [node.id];
                    //         }
                    //     }
                    // } else if ((intersection.length / n.relatesTo.length) >= 0.5) {
                    //     if (node.groupId !== undefined) {
                    //         n.groupId = node.groupId;
                    //         n.groupName = node.groupName;
                    //         setRelated(n);
                    //     } else {
                    //         if (node.groupRelated !== undefined) {
                    //             node.groupRelated.push(n.id);
                    //         } else {
                    //             node.groupRelated = [n.id];
                    //         }
                    //     }
                    // }
                }
            });
            relations.sort(function (a, b) {
                if (a.percent < b.percent) {
                    return 1;
                }
                if (a.percent > b.percent) {
                    return -1;
                }
                return 0;
            });
            console.log(relations)
            let newNode = {id: node.id, relations: relations.slice()};
            console.log(newNode)
            return newNode;
        });
        console.log(newnodes)
        resolve(newnodes);
    })
}

function findCommonElements(inArrays) {
    if (typeof inArrays === "undefined") return undefined;
    if (typeof inArrays[0] === "undefined") return undefined;

    return _.intersection.apply(this, inArrays);
}