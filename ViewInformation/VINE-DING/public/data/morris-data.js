$.ajax({
    url:'/searchEmotion',
    dataType:'json',
    type:'get'
}).done(function(html) {
    var dataArray = new Array();
    for(var i = 0; i < html.length; i++) {

        var dataInfo = new Object();

        dataInfo.period = Number(html[i]._id.toString());
        dataInfo.positive = Number(html[i].value.positive.toString());
        dataInfo.negative = Number(html[i].value.negative.toString());

        dataArray.push(dataInfo);
    }

    var data = JSON.stringify(dataArray);
    console.log(data);
    Morris.Area({
        element: 'morris-area-chart',
        data: JSON.parse(data),
        xkey: 'period',
        ykeys: ['positive', 'negative'],
        labels: ['positive', 'negative'],
        lineColors: ['#337ab7','#d9534f'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

    var positive = 0;
    var negative = 0;

    for(var i = 0; i < html.length; i++) {
        positive += Number(html[i].value.positive.toString());
        negative += Number(html[i].value.negative.toString());
    }

    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "Positive",
            value: positive
        }, {
            label: "Negative",
            value: negative
        }],
        colors: ['#337ab7','#d9534f'],
        resize: true
    });
});

$.ajax({
    url:'/getDatabaseData',
    dataType:'json',
    type:'get'
}).done(function(dbData) {
    $("#sns-data").html(dbData.count);
});

$.ajax({
    url:'/getDatabaseList',
    dataType:'json',
    type:'get'
}).done(function(dbData) {
    $("#data-amount").html(dbData + " GB");
});