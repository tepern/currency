import './styles/styles.scss';

const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        getCurrency(xhttp.responseXML); 
    }
};
xhttp.open("GET", "http://localhost:8080/api", true);
xhttp.send();

const whttp = new XMLHttpRequest();
whttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) { 
       getWeather(whttp.responseXML);
    }
};
whttp.open("GET", "http://localhost:8080/weather", true);
whttp.send();

const el = document.getElementById("update");
el.addEventListener("click", update, false);

function getCurrency(xml) {
    const container = document.querySelector(".container");
    const currency = xml.getElementsByTagName("ValCurs");
    const currencyList = ["Доллар США", "Евро", "Шведских крон", "Японских иен", "Канадский доллар"];
    const currencyWrap = document.createElement('ul');
    
    let arr = [];
    let nodes = currency[0].childNodes;

    for (let i=0; i<nodes.length; i++) {
        let item = [];
        const items = nodes[i].childNodes;
        for (let k=0; k<items.length; k++) {
            item[items[k].tagName] = items[k].innerHTML;  
        }
        arr.push(item); 
        
    }
    if (arr) {
        let result = arr.filter((item) => currencyList.includes(item['Name']));
        
        const blocks = result.map((item) => {
            const currencyHtmlItem = document.createElement('li');
            const currencyData = document.createElement('p');
            currencyData.append(item['Nominal'] + ' ' + item['CharCode'] + ' ='+ ' '+ item['Value'] + ' RUB');
            const currencyTitle = document.createElement('p');
            currencyTitle.append(item['Name']);  
            currencyHtmlItem.append(currencyData);
            currencyHtmlItem.append(currencyTitle);
            return currencyHtmlItem;
        });
        currencyWrap.append(... blocks);
        currencyWrap.setAttribute('class', 'currency');
        container.append(currencyWrap);
    };
}

function getWeather(xml) {
    const container = document.querySelector(".container");
    const current = xml.getElementsByTagName("temp_c")[0].innerHTML;
    const feel = xml.getElementsByTagName("feelslike_c")[0].innerHTML;
    const text = xml.getElementsByTagName("text")[0].innerHTML;
    const time = xml.getElementsByTagName("localtime")[0].innerHTML;
    
    const month = [1,2,3,4,5,6,7,8,9,10,11,12]; 
    const weatherWrap = document.createElement('div');
    weatherWrap.setAttribute('class', 'weather');
    const city = document.createElement('p');
    const localtime = new Date(time);
    const localT = document.createElement('span');
    localT.append(localtime.getDate("DD") + "." + month[localtime.getMonth()]);
    city.append("Москва ");
    city.append(localT);
    city.setAttribute('class', 'weather__city');
    const t = document.createElement('p');
    t.append("Температура ");
    t.setAttribute('class', 'weather__temperature');
    const tem = document.createElement('span');
    tem.append(current);
    const grad = document.createElement('span');
    grad.innerHTML = "&deg;";
    tem.append(grad);
    t.append(tem);
    const feellike = document.createElement('p');
    feellike.append("Ощущается как ");
    feellike.setAttribute('class', 'weather__feel');
    const feellikeT = document.createElement('span');
    feellikeT.append(feel);
    const gradT = document.createElement('span');
    gradT.innerHTML = "&deg;";
    feellikeT.append(gradT);
    feellike.append(feellikeT);
    const cloud = document.createElement('p');
    cloud.append(text);
    cloud.setAttribute('class', 'weather__text');
    weatherWrap.append(city);
    weatherWrap.append(t);
    weatherWrap.append(feellike);
    weatherWrap.append(cloud);
    container.prepend(weatherWrap);
}

function update(xml) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const div = document.querySelector('.currency');
            div.remove();
            getCurrency(xhttp.responseXML); 
        }
    };
    xhttp.open("GET", "http://localhost:8080/api", true);
    xhttp.send();
}