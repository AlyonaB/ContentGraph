let table;

function load(url) {
    $.post('/generator/load', {data: url}, (data) => {
        data.data.sort(function (a, b) {
            if (a.relatesTo.length < b.relatesTo.length) {
                return 1;
            }
            if (a.relatesTo.length > b.relatesTo.length) {
                return -1;
            }
            return 0;
        });
        let groupedNodes = divideForGroups(data.data);
        console.log(groupedNodes.groups);
        let editor = new $.fn.dataTable.Editor({
            table: "#links_table",
            idSrc: 'id',
            fields: [
                {
                    label: "Name:",
                    name: "name"
                },
                {
                    label: "Group: ",
                    name: "groupName"
                }
            ]
        });

        $('#links_table').on('click', 'tbody td.editable', function (e) {
            console.log(e);
            if (this !== undefined)
                editor.inline(this);
        });

        table = $('#links_table').DataTable({
            data: groupedNodes.nodes,
            columns: [
                {title: "#", data: "id"},
                {title: "Name", data: "name", className: 'editable'},
                {title: "Url", data: "url"},
                {title: "Group", data: "groupName", className: 'editable'}
                // {title: "Relates to", data: "relatesTo", visible: false}
            ]
        });
        $('#loader').hide();

        $('#download').on('click', function () {
            console.log('works!')
            let data = table.data();
            console.log(data);
            $.post('/generator/download', {data: data},
                function (res) {
                    console.log("downloading")
                })
        });
        $('#preview').click(function () {
            console.log('works!')
            let data = table.data();
            console.log(data);
            $.post('/generator/graph', {data: data},
                function (res) {
                    console.log("downloading")
                })
        });
        $('button.download').toggle();
        $('button.preview').toggle();
    })
        .fail(function () {
            $('#loader').hide();
            $('.alert').val('Sorry, 500 Internal Server Error')
            $('.alert').toggle();
        })
}
