const Apify = require('apify');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { features } = require('process');

const {
    utils: { log },
} = Apify;

exports.handleStart = async ({ $, crawler }) => {
    // console.console.log("Hello Start Here!")
    const body = $(
        'script[data-zrr-shared-data-key="mobileSearchPageStore"]'
    ).html();
    const rawJson = body.match(/<!--(.*)-->/)[1];
    const json = JSON.parse(rawJson);
    const totalListing = json['categoryTotals']['cat1']['totalResultCount'];
    const totalPage = Math.ceil(totalListing / 40);
    const listing = json['cat1']['searchResults']['listResults'];
    // console.console.log(listing)
    console.log(
        `Total Lisitng Found : ${totalListing} \n Total Page : ${totalPage}`
    );

    if (listing.length != 0) {
        for (let i = 0; i < listing.length; i++) {
            let list = listing[i];
            let url = list['detailUrl'];
            console.log(`Requesting Detail Page: ${url}`);
            await crawler.requestQueue.addRequest({
                url,
                userData: {
                    label: 'DETAIL',
                    data: list,
                },
            });
        }
    }

    const config = {
        headers: {
            authority: 'www.zillow.com',
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            cookie: 'zguid=24|%248c7be17e-7ba3-41c1-bd48-8e57113b94d0; zgsession=1|1f57b556-fa34-4874-9296-341339c6c410; pxcts=a56869a1-07e5-11ed-b3eb-58444e466469; _pxvid=a5685242-07e5-11ed-b3eb-58444e466469; JSESSIONID=0CF348CE8749941810C0F5DF0EAD17C7; search=6|1661188881986%7Cregion%3Dny%26rect%3D45.015865%252C-71.777491%252C40.477399%252C-79.76259%26disp%3Dmap%26mdm%3Dauto%26type%3Dhouse%26fs%3D1%26fr%3D0%26mmm%3D1%26rs%3D0%26ah%3D0%09%0943%09%09%09%09%09%09; _pxff_bsco=1; _px3=5da550d51c3976fe38b7a7ac4da02bd33fc5311021709c4c0151984c77662dc9:BIx71CSwaCIh9Jj2VWkAsFx3U8Df5nXGxt8RirJjiARcl2yPx4SxqrGkomsBifYBOW5chla+bcn+TCW9hGkdTQ==:1000:Yotvulcs6Ci3TnjX7ZroT3Q2Io74W32f5lCy2vl4DVaDKeCFsg2hXvzU0Sv6YBadp8i8kkglL90ahFL5Yx61/LomKWAczSYl/u6cPE9mdJuES5Fat657WEYXn5dWfjZQE1Rqs+CfHKKZ4Eu9M3GoQYm1BueF9DXEysvdPH5ZaCmS6dKv8UC70nwp7o9xxZKTUlb0QkP2BDHhxsbWwB+r6g==; AWSALB=WKd/Ca1DFZJ5QHDKsNou7j1wN5VqollFD5MkJnRaZpzq4HiCV+WZzlMjZnmgo2zXoN5RNw6/+lXbVUJk9tADzq4Z8sOL2xuMkhzVG3TMs0C/v72G3K7alu+pNpE1; AWSALBCORS=WKd/Ca1DFZJ5QHDKsNou7j1wN5VqollFD5MkJnRaZpzq4HiCV+WZzlMjZnmgo2zXoN5RNw6/+lXbVUJk9tADzq4Z8sOL2xuMkhzVG3TMs0C/v72G3K7alu+pNpE1',
            'user-agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36',
        },
    };

    for (let i = 2; i <= totalPage; i++) {
        let requestUrl = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState=%7B%22pagination%22%3A%7B%22currentPage%22%3A${i}%7D%2C%22usersSearchTerm%22%3A%22NY%22%2C%22mapBounds%22%3A%7B%22west%22%3A-81.59279440625%2C%22east%22%3A-69.94728659375%2C%22south%22%3A38.37704388296875%2C%22north%22%3A46.906054688559585%7D%2C%22mapZoom%22%3A6%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A43%2C%22regionType%22%3A2%7D%5D%2C%22isMapVisible%22%3Afalse%2C%22filterState%22%3A%7B%22isCondo%22%3A%7B%22value%22%3Afalse%7D%2C%22isApartment%22%3A%7B%22value%22%3Afalse%7D%2C%22isMultiFamily%22%3A%7B%22value%22%3Afalse%7D%2C%22keywords%22%3A%7B%22value%22%3A%22tlc%22%7D%2C%22isAllHomes%22%3A%7B%22value%22%3Atrue%7D%2C%22sortSelection%22%3A%7B%22value%22%3A%22days%22%7D%2C%22isLotLand%22%3A%7B%22value%22%3Afalse%7D%2C%22isTownhouse%22%3A%7B%22value%22%3Afalse%7D%2C%22isManufactured%22%3A%7B%22value%22%3Afalse%7D%2C%22isApartmentOrCondo%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%7D&wants={%22cat1%22:[%22listResults%22],%22cat2%22:[%22total%22],%22regionResults%22:[%22total%22]}&requestId=${i}`;
        console.log(`API for Page Number : ${i} >> (${requestUrl})`);
        let res = await axios.get(requestUrl, config);
        let listing = res['data']['cat1']['searchResults']['listResults'];
        // console.console.log(res)
        if (listing.length != 0) {
            for (let j = 0; j < listing.length; j++) {
                let list = listing[j];
                let url = list['detailUrl'];
                console.log(`Requesting Detail Page: ${url}`);
                await crawler.requestQueue.addRequest({
                    url,
                    userData: {
                        label: 'DETAIL',
                        data: list,
                    },
                });
            }
        }
    }
};

exports.handleDetail = async ({ request, $ }) => {
    let jData = JSON.parse($('#hdpApolloPreloadedData').html());

    jData = JSON.parse(jData['apiCache']);

    const objK = Object.keys(jData);
    jData = jData[objK[1]];
    jData = jData['property'];

    const data = request.userData.data;

    let arr = {};
    arr['ZPID'] = jData['zpid'];
    arr['Full Address'] = data['address'];
    arr['Street'] = data['addressStreet'];
    arr['City'] = data['addressCity'];
    arr['State'] = data['addressState'];
    arr['Zip Code'] = data['addressZipcode'];
    arr['Price'] = data['price']
    if (arr['Price']) {
        arr['Price'] = arr['Price'].replaceAll(',', '').replaceAll('$', '');
    }
    arr['Beds'] = data['beds'];
    arr['Baths'] = data['baths'];
    arr['SqFt'] = data['area'];
    arr['Status'] = data['hdpData']['homeInfo']['homeStatus'].replaceAll('_', ' ');
    arr['Property Type'] = data['hdpData']['homeInfo']['homeType'].replaceAll('_', ' ');
    arr['Year Built'] = jData['yearBuilt'];

    let features = jData['resoFacts']['atAGlanceFacts'];
    const valid = ['Heating', 'Cooling', 'Parking', 'Lot', 'Price/sqft'];
    for (let feature of features) {
        if (valid.includes(feature['factLabel'])) {
            arr[feature['factLabel']] = feature['factValue']
            if (feature['factValue']) {
                arr[feature['factLabel']] = feature['factValue'].replaceAll(',', '').replaceAll('$', '');
            }
        }
    }
    try {
        arr['Company'] = jData['attributionInfo']['brokerName'];
        arr['Phone'] = jData['attributionInfo']['agentPhoneNumber'];
        let fullName = jData['attributionInfo']['agentName'];
        if (fullName) {
            fullName = fullName.trim();
        }
        fullName = fullName.split('-')[0]
        arr['Full Name'] = fullName;
        if (arr['Full Name'].split(' ').length == 2) {
            let firstName = fullName.split(' ')[0];
            let lastName = fullName.split(' ')[1];
            // if(firstName.trim() && lastName.trim() == ''){
            //     lastName = fullName.replaceAll(firstName,'').trim()
            // }
            arr['First Name'] = firstName
            arr['Last Name'] = lastName
        }
        if (arr['Full Name'].split(' ').length == 3) {
            arr['First Name'] = arr['Full Name'].split(' ')[0];
            arr['Last Name'] = arr['Full Name'].split(' ')[2];
            if (arr['Last Name'].trim() == '') {
                arr['Last Name'] = arr['Full Name'].split(' ')[1] 
            }

        }
        arr['Mobile'] = jData['attributionInfo']['brokerPhoneNumber'];
    } catch (err) {
        console.log("not found ")
    }
    arr['Description'] = jData['description'];
    arr['Time on Zillow'] = jData['timeOnZillow'];
    arr['Zillow Views'] = jData['pageViewCount'];
    arr['Zillow Saves'] = jData['favoriteCount'];
    arr['MLS Number'] = jData['mlsid'];
    arr['County'] = jData['county'].replaceAll('County', '');
    arr['Property Image'] = data['imgSrc'];

    console.log(arr);
    // process.exit()
    Apify.pushData(arr);
};