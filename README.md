[link]
{
  "startUrls": [
    {
      "url": "https://www.zillow.com/ny/houses/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%22NY%22%2C%22mapBounds%22%3A%7B%22west%22%3A-81.59279440625%2C%22east%22%3A-69.94728659375%2C%22south%22%3A38.37704388296875%2C%22north%22%3A46.906054688559585%7D%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A43%2C%22regionType%22%3A2%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22sort%22%3A%7B%22value%22%3A%22days%22%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22tow%22%3A%7B%22value%22%3Afalse%7D%2C%22mf%22%3A%7B%22value%22%3Afalse%7D%2C%22con%22%3A%7B%22value%22%3Afalse%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%2C%22apco%22%3A%7B%22value%22%3Afalse%7D%2C%22att%22%3A%7B%22value%22%3A%22tlc%22%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A6%7D"
    }
  ]
}

Steps : 
1. Input URL >> from apify_storage/key_value_stores../INPUT.JSON
2. Goes to handle page > handleStart(context). in src/routes/handleStart -> getJson Data -> totalNumber of page -> loop each page via api. along with pass detail page link to handleDetail function. 
3. extract remaining data from -> $('#hdpApolloPreloadedData').html() 

