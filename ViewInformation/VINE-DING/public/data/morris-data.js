$.ajax({
    url:'/searchEmotion',
    dataType:'json',
    type:'get'
}).done(function(html) {
    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: Number(html[0]._id.toString()),
            positive: Number(html[0].value.positive.toString()),
            negative: Number(html[0].value.negative.toString())
        }, {
            period: Number(html[1]._id.toString()),
            positive: Number(html[1].value.positive.toString()),
            negative: Number(html[1].value.negative.toString())
        }, {
            period: Number(html[2]._id.toString()),
            positive: Number(html[2].value.positive.toString()),
            negative: Number(html[2].value.negative.toString())
        }, {
            period: Number(html[3]._id.toString()),
            positive: Number(html[3].value.positive.toString()),
            negative: Number(html[3].value.negative.toString())
        }, {
            period: Number(html[4]._id.toString()),
            positive: Number(html[4].value.positive.toString()),
            negative: Number(html[4].value.negative.toString())
        }, {
            period: Number(html[5]._id.toString()),
            positive: Number(html[5].value.positive.toString()),
            negative: Number(html[5].value.negative.toString())
        }, {
            period: Number(html[6]._id.toString()),
            positive: Number(html[6].value.positive.toString()),
            negative: Number(html[6].value.negative.toString())
        }, {
            period: Number(html[7]._id.toString()),
            positive: Number(html[7].value.positive.toString()),
            negative: Number(html[7].value.negative.toString())
        }, {
            period: Number(html[8]._id.toString()),
            positive: Number(html[8].value.positive.toString()),
            negative: Number(html[8].value.negative.toString())
        }, {
            period: Number(html[9]._id.toString()),
            positive: Number(html[9].value.positive.toString()),
            negative: Number(html[9].value.negative.toString())
        }],
        xkey: 'period',
        ykeys: ['positive', 'negative'],
        labels: ['positive', 'negative'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

    var positive = 0;
    var negative = 0;

    for(var i = 0; i < 10; i++) {
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
        resize: true
    });
});