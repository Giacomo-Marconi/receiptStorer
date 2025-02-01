const pages = ['dashboard', 'bilancio', 'transazioni'];
const months= [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre"
  ];
let expense = [];
const today = new Date();
let data = [today.getDate(), today.getMonth(), today.getFullYear()];
let bilancio = [];
let currentPage = "";

const Month = document.querySelector("#month");
const Year = document.querySelector("#year");
const previousBtn = document.querySelector("#previous-month");
const nextBtn = document.querySelector("#next-month");
const valMonth = document.getElementById('valMonth');
const valYear = document.getElementById('valYear');
const form = document.getElementById('date');
const todayB = document.getElementById('ButtonMonth');





function setTransaction(){
    document.getElementById('CheckboxUscita').style.backgroundColor = '#E74C3C';
    document.getElementById('CheckboxUscita').style.padding = '5px';
    document.getElementById('CheckboxUscita').style.border = 'none';
    document.getElementById('PButtonUscita').style.fontWeight = '600';
}



function showPage(page) {
    currentPage = page;
    loadPage();
    pages.forEach(p => {
    console.log((String(p)).toUpperCase())
    if (p === page) {
      document.getElementById((String(p)).toUpperCase()).style.display = 'flex';
      document.getElementById(`img${p}`).src = `./icons/${p}_active.png`;
      document.getElementById(`p${p}`).classList.add('active');
    } else {
      document.getElementById(`img${p}`).src = `./icons/${p}.png`;
      document.getElementById((String(p)).toUpperCase()).style.display = 'none';
      document.getElementById(`p${p}`).classList.remove('active');
    }
  });
}


function addLastTran() {
    const tableTransactions = document.getElementById('tableTransactions');
    tableTransactions.innerHTML = '';
    fetch ('http://127.0.0.1:20002/lastReceipt?id=1', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        data.map((element) => {
            const date = new Date(element.data).toDateString();
            addRow('tableTransactions', [element.id, date, element.totale, element.negozio]);
        });
    })
}


function addRow(table, data) {
    const tb = document.getElementById(table);
    const tr = document.createElement('tr');
    data.map(e => {
        tr.appendChild(createTd(e));
    });
    tb.appendChild(tr);
}

function createTd(what) {
    const td = document.createElement('td');
    const p = document.createElement('p');
    p.innerHTML = what;
    td.appendChild(p);
    return td;
}

const displayMonth = (m) => {
    Month.innerHTML = months[m];
}

const displayYear = (y) => {
    Year.innerHTML = y;
}




function loadDashboardData(date) {
    console.log(date);
    const mountBalance = document.getElementById('mountBalance');
    addLastTran();

    displayMonth(date[1])
    displayYear(date[2])

    
    const dataArg = date[2] + '-' + (date[1] + 1) + '-' + date[0];

    fetch ('http://127.0.0.1:20002/statsMese?data='+dataArg, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const now = new Date(date[2], date[1], date[0]);
        const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        //console.log(totalDays);
        expense = Array(totalDays).fill(0);
        
        data.map(e => {
            const d = new Date(e.data).getDate();
            expense[d-1] += e.totale;
        });
        
        showCHartsDashboard();
        
        const tot = data.reduce((acc, e) => acc + e.totale, 0);
        mountBalance.innerHTML = tot;
        
    });
}

function showCHartsDashboard() { 
    Highcharts.chart('container', {
        colors: ['#45C682', '#E74C3C'],
        chart: {
            type: 'areaspline',
            zoomType: 'x',
            resetZoomButton: {
                position: {
                    x: -70,
                    y: 10
                },
                relativeTo: 'chart',
                theme: {
                    fill: 'white',
                    style: {
                        color: '#E74C3C',
                        text: {
                            y: '15'
                        },
                        
                    },
                    stroke: 'silver',
                    r: 10,
                    states: {
                        hover: {
                            fill: '#E74C3C'
                        }
                    }
                }
            },
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20','21','22','23','24','25','26','27','28','29','30','31'],
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                
                
                marker: {
                    radius: 3
                },
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 2.5,
                    }
                },
                threshold: null
            },
            
        },
        series: [{
            type: 'area',
            name: 'Uscite',
            //data: [30, 40, 33, 36, 39, 43, 34.5, 35.5, 36.5, 37.5, 38.5, 39.5, 40.5, 46, 31, 30, 28.65, 28.7, 28.88, 29.5, 30.5, 31.5, 32.5, 33.5, 41.5, 42.5, 43.5, 44.5, 45.5, 46.5, 47.5]    
            data: expense
        }],
        navigation: {
            buttonOptions: {
                enabled: false
            }
        }
    });
}




function totSettimanale(transazioni) {
    const meseStart = new Date(data[2], data[1], 1);
    const meseEnd = new Date(data[2], data[1] + 1, 0);

    let tot = [0];
    //prima sett
    let start = meseStart;
    while (start.getDay() != 6) {
        transazioni.map(e => {
            const d = new Date(e.data);
            if (d.getDate() == start.getDate()) {
                tot[0] += e.totale;
            }
        });
        start = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
    }

    transazioni.map(e => {
        const d = new Date(e.data);
        if (d.getDate() == start.getDate()) {
            tot[0] += e.totale;
        }
    });
    start = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);


    //altre sett
    let week = 1;
    while (start < meseEnd) {
        tot.push(0);
        tot[week] = 0;
        for (let i = 0; i < 7; i++) {
            console.log("*");
            if(start >= meseEnd) {
                break;
            }
            transazioni.map(e => {
                const d = new Date(e.data);
                if (d.getDate() == start.getDate()) {
                    tot[week] += e.totale;
                }
            });
            start = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
        }
        week++;
    }
    return tot;
}

function loadBilancio(date) {
    displayMonth(date[1])
    displayYear(date[2])

    const bilancioTot = document.getElementById('bilancio-tot');

    const dataArg = date[2] + '-' + (date[1] + 1) + '-' + date[0];
    
    fetch ('http://127.0.0.1:20002/statsMese?data='+dataArg, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);


            const tot = data.reduce((acc, e) => acc + e.totale, 0);
            bilancioTot.innerHTML = tot + " <span class='euro'>EURO</span>";
            console.log(tot);

            bilancio = totSettimanale(data);
            showCHartsBilancio();
        });
        
}

function showCHartsBilancio(){
    Highcharts.chart('container3', {
      chart: {
        type: 'column',
        animation: false,
      },
      colors: ['#E74C3C'],
      title: {
        text: 'Uscite € / Settimane',
        align: 'center'
      },
      xAxis: {
        categories: bilancio.map((e, i) => (i + 1)),
        title: {
          text: 'Settimane'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Uscite €'
        },
        stackLabels: {
          enabled: true
        }
      },
      legend: {
        enabled:false,
    
        // align: 'left',
        // x: 70,
        // verticalAlign: 'top',
        // y: 70,
        // floating: true,
        // backgroundColor:
        //   Highcharts.defaultOptions.legend.backgroundColor || 'white',
        // borderColor: '#CCC',
        // borderWidth: 1,
        // shadow: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: false
          }
        }
      },
      series: [{
        name: 'Uscite',
        data: bilancio
      }]
    });
}
    


function loadTransazioni(data) {
    const transazioniTot = document.getElementById('transazioni-tot');
    
    displayMonth(data[1])
    displayYear(data[2])
    
    const table = document.getElementById('table-transazioni');
    const dataArg = data[2] + '-' + (data[1] + 1) + '-' + data[0];
    fetch('http://127.0.0.1:20002/receipt?id=1&data='+dataArg, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const tot = data.reduce((acc, e) => acc + e.totale, 0);
        transazioniTot.innerHTML = tot + " <span class='euro'>EURO</span>";

        table.innerHTML = '';
        data.map(e => {
            const date = new Date(e.data).toDateString();
            addRow('table-transazioni', [e.id, date, e.totale, e.negozio]);
        });

    });
    
}




function loadPage() {
    if(currentPage == 'dashboard'){
        loadDashboardData(data);
    }
    if(currentPage == 'bilancio'){
        loadBilancio(data);
    }
    if(currentPage == 'transazioni'){
        loadTransazioni(data);
    }
}








previousBtn.addEventListener("click", (event) => {
    console.log("prec");
    event.preventDefault();
    if (data[1]==0){
        data[1]=11;
        data[2]--;
    }else{
        data[1]--;
    }

    loadPage();

});


nextBtn.addEventListener("click", (event) => {
    console.log("next");
    event.preventDefault();
    if (data[1]==11){
        data[1]=0;
        data[2]++;
    }else{
        data[1]++;
    }
    
    loadPage();

});


todayB.addEventListener("click", () => {
    const today = new Date();
    data = [today.getDate(), today.getMonth(), today.getFullYear()];
    
    loadPage();
});


window.onload = function () {
    setTransaction();
    showPage('dashboard');
}


const divAddScontrino = document.getElementById('DivAddButton')
const blur = document.getElementById('blur')

function addScontrino(){
  divAddScontrino.style.display = 'block';
  blur.style.display = 'flex';
}


function closeAll(){
  divAddScontrino.style.display = 'none';
  blur.style.display = 'none';
}

const fileInput = document.getElementById('file-upload');
const img = document.getElementById('imgUp');

const idInp = ['numero', 'data', 'negozio', 'totale', 'perc'];
const key = ['number', 'date', 'merchant_name', 'total', 'perc'];

function updateData(date){
    idInp.map((e, i) => {
        console.log(e, i);
        console.log(date[key[i]]);
        document.getElementById(e).value = date[key[i]];
    });

    document.getElementById('luogo').value = date.address;
}


function clearInpit() {
    idInp.map(e => {
        document.getElementById(e).value = '';
    });

    document.getElementById('luogo').value = '';
    const im = document.createElement('img');
    im.src = '';
}



fileInput.addEventListener('change', function(event) {
    console.log("send")
    
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    
    fetch('http://127.0.0.1:20002/analize', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        
        if(data.error){
            console.log(data.error);
            alert("errore richiesta");
            return;
        }
        
        updateData(data);
            
    });


    const im = document.createElement('img');
    im.src = URL.createObjectURL(event.target.files[0]);
    img.innerHTML = '';
    img.appendChild(im);
    console.log("sended")
});





const conferm = document.getElementById('conferm');
conferm.addEventListener('click', () => {

    const data = document.getElementById('data').value;

    //data regex
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    if(!regex.test(data)){
        alert("fix format date: muust be yyyy-mm-dd");
        return;
    }

    const negozio = document.getElementById('negozio').value;
    const totale = document.getElementById('totale').value;
    const numero = document.getElementById('numero').value;
    const luogo = document.getElementById('luogo').value;
    const perc = document.getElementById('perc').value;

    const dataArg = {
        data: data,
        negozio: negozio,
        totale: totale,
        numero: numero,
        luogo: luogo,
        perc: perc,
    }


    fetch('http://127.0.0.1:20002/addData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataArg)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.error){
            console.log(data.error);
            alert("errore richiesta");
            return;
        }
        closeAll();
        loadPage();
    });

});

