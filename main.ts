/// <reference path ="node_modules/@types/jquery/JQuery.d.ts"/>

const daysPerYear = 365,
    round2 = function (value) {
      return Math.round(value * 100) / 100;
    };

const currency = new Intl.NumberFormat("ru", {
    "style": "currency",
    "currency": "RUB"
}),
    formatter = new Intl.NumberFormat("ru", {
       "useGrouping": true,

       "minimumFractionDigits": 2
    });

class Route {
    public busses: number;
    public hours: number;
    public kilometers: number;
    public flights_workdays: number;
    public flights_weekend: number;
    public workdays = 247;
    public weekends = 118;

    public result : number;

    constructor(busses: number, hours: number, kilometers: number, flights_workdays: number, flights_weekend: number) {
        this.busses = busses;
        this.hours = hours;
        this.kilometers = kilometers;
        this.flights_workdays = flights_workdays;
        this.flights_weekend = flights_weekend;
    }

    calc() {
       let c = {};
       c[8] = this.busses * this.hours * daysPerYear;
       c[9] = this.kilometers * (this.flights_workdays * this.workdays + this.flights_weekend * this.weekends);
       c[10] = 90000;
       c[11] = 70000;
       c[12] = 1.08;
       c[13] = 1.0;
       c[14] = 1.04;
       c[15] = 1744;
       c[16] = 1832;
       c[17] = 39.8;
       c[18] = 7.5;
       c[19] = 3.5;
       c[20] = c[17] / 100 * (1+0.01 * c[18]) + c[19] / (c[9] / c[8]) * 6/12;
       c[21] = 56;
       c[22] = 1.014;
       c[23] = 13.3;
       c[24] = 0.9;
       c[25] = 10.2;
       c[26] = 1.2;
       c[27] = 34.8;
       c[28] = 0.84;
       c[29] = 1.045;
       c[30] = 1.156;
       c[31] = 6.4;
       c[32] = 1.25;
       c[33] = 0.58;
       c[34] = 0.96;
       c[35] = 1.048;
       c[36] = 12;
       c[37] = 11000000;
       c[38] = 12;
       c[39] = 7;
       c[42] = round2(12 * 1.2 * c[10] * c[13] * c[8] * c[12] * c[14] / (c[9] * c[15])); // =ОКРУГЛ(12*1,2*C10*C13*C8*C12*C14/(C9*C15);2)
       c[43] = round2(c[42] * c[27] / 100);
       c[44] = round2(c[21]*c[20]*c[22]); // =ОКРУГЛ(C21*C20*C22;2)
       c[45] = round2(c[44] * 0.075); // =ОКРУГЛ(C44*0,075;2)
       c[46] = round2(c[28] * c[30]); // =ОКРУГЛ(C28*C30;2)

        // =ОКРУГЛ(C31*C32*C30+0,001*12*1,2*C14*C11*C13*(C23/C24+C25*C26)/C16*(1+30,2/100);2)
       c[47] = round2(
           c[31] * c[32] * c[30] + 0.001 * 12 * 1.2 * c[14] * c[11] * c[13]
            * (c[23] / c[24] + c[25] * c[26]) / c[16] * (1 + 30.2/100)
        );

       c[48] = round2(c[33] * (c[44] + c[45] + c[46] + c[47])); // =ОКРУГЛ(C33*(C44+C45+C46+C47);2)
       c[40] = c[42]+c[43]+c[44]+c[45]+c[46]+c[47]+c[48];
       c[49] = c[40]*c[35]*c[9]/c[34] + c[36]*c[37]*c[29]*c[38]/(12 * c[39]); // =(C40*C35*C9/C34)+C36*C37*C29*C38/(12*C39)
       c[50] = 0;
       this.result = c[51] = round2(c[49] + c[50]);

       return c;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    $('#calc').on('click', () => {

        let busses = ~~$('#busses').val(),
            hours = ~~$('#hours').val(),
            kilometers = ~~$('#kilometers').val(),
            flights_workdays = ~~$('#flights_workdays').val(),
            flights_weekend = ~~$('#flights_weekend').val();
        const route = new Route(
            busses,
            hours,
            kilometers,
            flights_workdays,
            flights_weekend
        );

        let result = route.calc();
        $('#output').show();
        for (let key in result) {
            let value = result[key],
                $cell = $(`#td${key}`);

            if ($cell.hasClass('rouble')) {
                value = currency.format(value)
            } else {
                value = formatter.format(value);
            }
            $cell.text(value);
        }

        $('#c51').text(currency.format(result[51]));
    });
});
