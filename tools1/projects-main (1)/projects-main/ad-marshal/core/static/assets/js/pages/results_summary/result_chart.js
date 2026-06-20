var anomaly_id = 0;
$(document).ready(function() {
  var url = window.location.href;
  var id = url.substring(url.lastIndexOf("/") + 1);
  anomaly_id = id;
  view(id);
})


function view(id){
var data = {
        ID: id,
    }
    $.ajax({
            type: 'GET',
            url: '/view_anomaly',
            data: data,
        })
        .then(function(response) {
        json_content = response['json']
//        console.log(json_content)
        input_type=response['input_type']

        if(input_type==="multi"){
        document.getElementById('sar').style.display = 'none'
        $('#multi_view').html(toTable(json_content));
            console.log(input_type)
            $.ajax({
            type: 'GET',
            url: '/get_multi_data',
            data: data,
         })
            .then(function(response) {
                var res=JSON.parse(response.full_data)
                var cols=Object.keys(res)
                console.log(res,cols)
                var type=response.input_type
                var pointcolors = response.color
               //var anomaly_param = response.anomaly_param.toUpperCase();
                var anomaly_param = response.anomaly_param
                var xindex = [];
                var i=0;
                while(xindex.push(i++)<res[cols[0]].length);
                console.log(xindex)
                var colors=['#36a2eb', '#ffce56', '#9966ff','pink','blue','orange','violet','teal','black','coffee','cyan']
                var datasetArray=[];
                for (var i=0; i<cols.length; i++){
                var temp={
                 backgroundColor: 'white',
                 pointBackgroundColor: pointcolors,
                label: cols[i][0].toUpperCase() + cols[i].slice(1).toLowerCase(),
                borderColor: colors[i],
                fillColor: 'white',
                fill:false,
                grid:true,
                pointBorderColor: pointcolors,
                pointRadius: 5,
//                yAxesGroup: cols,
                data: res[cols[i]]
                }
                datasetArray.push(temp);
                }
                new Chart(document.getElementById('multi_results'), {
                    type: 'line',
                      data: {
                        labels: xindex,
                        datasets: datasetArray,
                      },
                      options: {
                          plugins: {
                            title: {
                                display: true,
                            },
                            legend: {
                                display: true,
                                position: 'bottom',
                            },
                        },
                        scales: {
                            x: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Index',
                                },
                                grid: {
                                display:false
                             },
                            },
                            y: {
                                display: true,
                                title: {
                                    display: true,
                                    text: "Values",
                                },
                            },
                        },

                      }
                    })

                var html = '', header_html =''
                    header_html += '<tr>'
                    header_html += '<th>' + "Index"+ '</th>'
                for (let c = 0; c < cols.length; c++){
                    header_html += '<th style="text-transform: capitalize;">' + cols[c] + '</th>'
                    }
                    header_html += '</tr>'
                $('#multi_header').html(header_html)

                    for (let i = 0; i < res[cols[0]].length; i++) {
                    html += '<tr>'
                    html += '<td style="color:'+response.color[i]+';">' + i+ '</td>'
                    for(col in cols) {
                    html += '<td style="color:'+response.color[i]+';">' + res[cols[col]][i]+ '</td>'
                }
                html += '</tr>'
                }
                $('#multi_list').html(html)
                document.getElementById('modal_view_chart').style.display = 'none'
                document.getElementById('multi_modal_view_chart').style.display = ''
                $('#multi_table').DataTable({searching: false, info: false, "pageLength": 5,"bLengthChange": false,})
                })
                .catch(() => {
                document.getElementById('multi_table').innerHTML = '&ensp;No Data available'
                document.getElementById('multi_modal_view_chart').innerHTML = '&ensp;No Chart available'
                });
                }
            else{
            document.getElementById('mar').style.display = 'none'
            $('#modal_view').html(toTable(json_content));
                console.log(input_type)
                $.ajax({
                    type: 'GET',
                    url: '/get_chart_data',
                    data: data,
                })
                .then(function(response) {
                var type=response.input_type
                var xValues = response.timeseries_data
                var yValues = response.full_data
                var pointcolors = response.color
                var anomaly_param = response.anomaly_param
                anomaly_param = anomaly_param[0].toUpperCase() + anomaly_param.slice(1).toLowerCase()
                new Chart(document.getElementById('results'), {
                    type: 'line',
                    data: {
                        labels: xValues,
                        datasets: [{
                                backgroundColor: pointcolors,
                                data: yValues,
                                label: 'Data',
                                borderColor: 'blue',
                                fill:false,
                                pointBorderColor: "white",
                                pointRadius: 5,
                            },
                         {
                           label: "Anomalies",
                          // data: yValues,
                           backgroundColor: "red",
                         },
                        ],
                    },
                    options: {
                        plugins: {
                            title: {
                                display: true,
                            },
                            legend: {
                                display: true,
                                position: 'bottom',
                            },
                        },
                        scales: {
                            x: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Timestamp',
                                },
                                grid: {
                                display:false
                             },
                            },
                            y: {
                                display: true,
                                title: {
                                    display: true,
                                    text: anomaly_param,
                                },
                            },
                        },
                    },
                })
                var html = '', header_html =''
                header_html += '<tr>'
                    header_html += '<th>' + "Index"+ '</th>'
                    header_html += '<th>' + "Timestamp"+ '</th>'
                    header_html += '<th style="text-transform: capitalize;">' + anomaly_param + '</th>'
                    header_html += '</tr>'
                $('#alldata_header').html(header_html)
//                console.log(response.full_data)
                    for (let i = 0; i < response.full_data.length; i++) {
                    html += '<tr>'
                    html += '<td style="color:'+response.color[i]+';">' + i+ '</td>'
                    html += '<td style="color:'+response.color[i]+';">' + response.timeseries_data[i]+ '</td>'
                    html += '<td style="color:'+response.color[i]+';">' + response.full_data[i]+ '</td>'
                    html += '</tr>'
                }
                $('#alldata_list').html(html)
                document.getElementById('modal_view_chart').style.display = ''
                document.getElementById('multi_modal_view_chart').style.display = 'none'
                $('#azure_table').DataTable({searching: false, info: false, "pageLength": 5,"bLengthChange": false,})
                })
                .catch(() => {
                    document.getElementById('modal_view_chart').innerHTML = '&ensp;No Chart available'
                    document.getElementById('azure_table').innerHTML = '&ensp;No Data available'
                });
                }
                })
                .catch(() => {
                    document.getElementById('modal_view').innerHTML = 'No data available'
                })
}


function toTable(json, colKeyClassMap, rowKeyClassMap){
    let tab;
    if(typeof colKeyClassMap === 'undefined'){
        colKeyClassMap = {};
    }
    if(typeof rowKeyClassMap === 'undefined'){
        rowKeyClassMap = {};
    }
    const newTable = '<table class="table table-bordered text-center" id="res_table" style="width:auto;text-transform: capitalize;" />';
    if($.isArray(json)){
        if(json.length === 0){
            return '[]'
        } else {
            const first = json[0];
            if($.isPlainObject(first)){
                tab = $(newTable);
                const row = $('<tr />');
                tab.append(row);
                $.each( first, function( key, value ) {
                if (key!='-1'){
                    row.append($('<th />').addClass(colKeyClassMap[key]).text(key))
                    }
                else if(key=='-1') {
                row.append($('<th>Index</th>'))
                }
                });
                $.each( json, function( key, value ) {
                    const row = $('<tr />');
                    $.each( value, function( key, value ) {
                        row.append($('<td />').addClass(colKeyClassMap[key]).html(toTable(value, colKeyClassMap, rowKeyClassMap)))
                    });
                    tab.append(row);
                });
                return tab;
            } else if ($.isArray(first)) {
                tab = $(newTable);
                $.each( json, function( key, value ) {
                    const tr = $('<tr />');
                    const td = $('<td />');
                    tr.append(td);
                    $.each( value, function( key, value ) {
                        td.append(toTable(value, colKeyClassMap, rowKeyClassMap));
                    });
                    tab.append(tr);
                });
                return tab;
            } else {
                return json.join(", ");
            }
        }
        $('#res_table').DataTable({searching: false, info: false, "pageLength": 5,"bLengthChange": false,})
        } else if($.isPlainObject(json)){
        tab = $(newTable);
        $.each( json, function( key, value ) {
            tab.append(
                $('<tr />')
                    .append($('<th style="width: 20%;"/>').addClass(rowKeyClassMap[key]).text(key))
                    .append($('<td />').addClass(rowKeyClassMap[key]).html(toTable(value, colKeyClassMap, rowKeyClassMap))));
        });
        $('#res_table').DataTable({searching: false, info: false, "pageLength": 5,"bLengthChange": false,})
        return tab;
        } else if (typeof json === 'string') {
        if(json.slice(0, 4) === 'http'){
            return '<a target="_blank" href="'+json+'">'+json+'</a>';
        }
        return json;
        } else {
        return ''+json;
    }
};

