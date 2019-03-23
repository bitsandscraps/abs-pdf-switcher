const str_arxiv_abs = "https://arxiv.org/abs/";
const str_arxiv_pdf = "https://arxiv.org/pdf/";

const str_earxiv_abs = "https://export.arxiv.org/abs/";
const str_earxiv_pdf = "https://export.arxiv.org/pdf/";

const str_openreview_abs = "https://openreview.net/forum?id=";
const str_openreview_pdf = "https://openreview.net/pdf?id=";

const str_nips = "papers.nips.cc/paper/";
const str_neurips = "papers.neurips.cc/paper/";

const pattern_pmlr_abs = "proceedings\\.mlr\\.press/v.*/.*\\.html";
const pattern_pmlr_pdf = "proceedings\\.mlr\\.press/v.*/.*\\.pdf";

function initializePageAction(tab) {
  tabid = tab.id;
  taburl = tab.url;
  var newurl;
  if (taburl.indexOf(str_arxiv_abs) != -1) {
    // Arxiv Abstract
    newurl = taburl.replace(str_arxiv_abs, str_arxiv_pdf);
    newurl += ".pdf"; // add .pdf
  } else if (taburl.indexOf(str_arxiv_pdf) != -1) {
    // Arxiv PDF
    newurl = taburl.replace(str_arxiv_pdf, str_arxiv_abs);
    newurl = newurl.slice(0, -4); //remove .pdf
  } else if (taburl.indexOf(str_earxiv_abs) != -1) {
    // Arxiv Mirror Abstract
    newurl = taburl.replace(str_earxiv_abs, str_earxiv_pdf);
  } else if (taburl.indexOf(str_earxiv_pdf) != -1) {
    // Arxiv Mirror PDF
    newurl = taburl.replace(str_earxiv_pdf, str_earxiv_abs);
  } else if (taburl.indexOf(str_openreview_abs) != -1) {
    // OpenReview Abstract
    newurl = taburl.replace(str_openreview_abs, str_openreview_pdf);
  } else if (taburl.indexOf(str_openreview_pdf) != -1) {
    // OpenReview PDF
    newurl = taburl.replace(str_openreview_pdf, str_openreview_abs);
  } else if (taburl.indexOf(str_nips) != -1) {
    if (taburl.indexOf(".pdf") == -1) {
      // NIPS Abstract
      newurl = taburl + ".pdf"; // add .pdf
    } else {
      // NIPS PDF
      newurl = taburl.slice(0, -4); // remove .pdf
    }
  } else if (taburl.indexOf(str_neurips) != -1) {
    if (taburl.indexOf(".pdf") == -1) {
      // NeurIPS Abstract
      newurl = taburl + ".pdf"; // add .pdf
    } else {
      // NeurIPS PDF
      newurl = taburl.slice(0, -4); // remove .pdf
    }
  } else if (taburl.search(pattern_pmlr_abs) != -1) {
    newurl = taburl.slice(0, -5); // remove .html
    var lastSlash = newurl.lastIndexOf("/");
    var paperName = newurl.slice(lastSlash);
    newurl += paperName + ".pdf"; // add .pdf
  } else if (taburl.search(pattern_pmlr_pdf) != -1) {
    var lastSlash = taburl.lastIndexOf("/");
    newurl = taburl.slice(0, lastSlash) + ".html"; // add .html
  } else {
    browser.pageAction.hide(tabid);
    return;
  }
  browser.pageAction.show(tabid);
  browser.pageAction.onClicked.addListener(() => {
    browser.tabs.update({url: newurl});
  });
}

// Each time a tab is updated, reset the page action for that tab.
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  // without changeInfo.attention, the user has to wait until the pdf is fully loaded
  if (!changeInfo.attention || changeInfo.status == "complete") {
    initializePageAction(tab);
  }
});
