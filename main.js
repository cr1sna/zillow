/**
 * This template is a production ready boilerplate for developing with `CheerioCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

const Apify = require('apify');
const { handleStart, handleList, handleDetail } = require('./src/routes');

const { utils: { log } } = Apify;

Apify.main(async () => {
    const { startUrls } = await Apify.getInput();
    log.info("Hii there")
    
    const dateTime = new Date()
    const time = dateTime.getTime()
    const queueName = `zillow_${time}`
    console.log(queueName) 

    
    const requestList = await Apify.openRequestList('start-urls', startUrls);
    // console.log(requestList)
    // process.exit()
    const requestQueue = await Apify.openRequestQueue(queueName);
    // const proxyConfiguration = await Apify.createProxyConfiguration();
    
    // await requestQueue.addRequest({
    //     url: "https://www.zillow.com/",
    //     userData: {
    //         label: "START_PAGE",
    //     },
    // });

    const crawler = new Apify.CheerioCrawler({
        requestList,
        requestQueue,
        // proxyConfiguration,
        // Be nice to the websites.
        // Remove to unleash full power.
        maxConcurrency: 1,
        handlePageFunction: async (context) => {
            const { url, userData: { label } } = context.request;
            log.info('Page opened.', { label, url });
            switch (label) {
                case 'DETAIL':
                    return handleDetail(context);
                case 'PAGINATION':
                    return handlePagination(context);
                default:
                    return handleStart(context);
            }
        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Crawl finished.');
});
