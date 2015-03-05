/*jshint strict:false*/
/*global CasperError, console, phantom, require*/

// USAGE:
// casperjs --ssl-protocol=tlsv1 li_searcher_v-0.2.js

// VERSION DIFF --trying to export this as JSON rather than HTML

var utils = require('utils');

var casper = require("casper").create({
  verbose: true,
  logLevel: 'error',
  clientScripts: ["includes/jquery-2.1.1.js"],
  viewportSize: {
    width: 1024,
    height: 768
  },
  pageSettings: {
    loadImages: true,
    loadPlugins: true,
    userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36'
  },
  onWaitTimeout: function() {
    var results = fs.read('no_results.html');
    casper.echo('ID: ' + link.id + ' Name: ' + link.target + ' Company: ' + link.company);

    fs.write('results/' + fileName + '.html', results, 'w');
  } // this is a setting to control what happens if casper can't find the 'li.entity' element in the remote DOM
}); // Initialize Casperjs and determine the browser settings

casper.options.waitTimeout = 5000;

var colorizer = require('colorizer').create('Colorizer');

var fs = require('fs'); // Give the ability to write files to the application

var LI_LOGIN_URL = 'http://www.linkedin.com';
var LI_LOGIN_USERNAME = 'enaff@clearslide.com';
var LI_LOGIN_PASSWORD = 'dataN1nj@'; // LinkedIn login info

Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  var hh = this.getHours().toString();
  var mins = this.getMinutes().toString();
  return yyyy + ' ' + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]) + ' ' + hh + '_' + mins; // padding
};

currentDate = new Date();
currentDate.yyyymmdd();

var fs = require('fs');

var suspects = [];

// The base links array,
var links = [
    {uri: "http://www.linkedin.com/sales/profile/120377523,fug-,NAME_SEARCH?moduleKey=sales-search&pageKey=peopleSearch&requestId=23293582-885e-4ee5-83f9-e6524c19bc34&contextId=58C76FBF998FAF13B0ADEFC4AC2A0000", target: "Ryan Williams", company: "Pearle Vision Jacksonville", id: "00Qi000000feJFK", num: "001"},
    {uri: "http://www.linkedin.com/sales/profile/204555778,H8SB,NAME_SEARCH?moduleKey=sales-search&pageKey=peopleSearch&requestId=672a5ff6-2350-413d-9ffe-0487a93f39f9&contextId=24B20DB19A8FAF13501D1ABCAC2A0000", target: "Gregory Estes", company: "Monrovia Growers", id: "00Qi000000gkLJK", num: "003"},
    {uri: "http://www.linkedin.com/sales/profile/56043297,nvn-,NAME_SEARCH?moduleKey=sales-search&pageKey=peopleSearch&requestId=672a5ff6-2350-413d-9ffe-0487a93f39f9&contextId=24B20DB19A8FAF13501D1ABCAC2A0000", target: "Ramiro A Ramirez", company: "Link Engineering Company", id: "00Qi000000gkLJL", num: "004"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Gonzalo+Baeza+CSAV", target: "Gonzalo Baeza", company: "CSAV", id: "00Qi000000gkLJP", num: "005"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Junior+Molina+Encofrados+Alsina+S.A:", target: "Junior Molina", company: "Encofrados Alsina S.A:", id: "00Qi000000gkLJb", num: "006"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Brett+Marshall+MEDVED+CHEVROLET", target: "Brett Marshall", company: "MEDVED CHEVROLET", id: "00Qi000000gkLJi", num: "007"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Cindy+Hornsby+Crystal+Inn+Hotel+and+Suites", target: "Cindy Hornsby", company: "Crystal Inn Hotel and Suites", id: "00Qi000000gkLJj", num: "008"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Paul+Bert+IFL+Group", target: "Paul Bert", company: "IFL Group", id: "00Qi000000gkLJq", num: "009"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Raymond+Lefante+Meridian+Health", target: "Raymond Lefante", company: "Meridian Health", id: "00Qi000000gkLJs", num: "010"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Danielle+Lachance+InVentiv+Health+Clinical", target: "Danielle Lachance", company: "InVentiv Health Clinical", id: "00Qi000000gkLJu", num: "011"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=David+Pearson+MillerCoors", target: "David Pearson", company: "MillerCoors", id: "00Qi000000gkLK1", num: "012"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Scott+Mowry+LiftMaster", target: "Scott Mowry", company: "LiftMaster", id: "00Qi000000gkLK7", num: "013"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=John+Konior+Betatronix+Inc", target: "John Konior", company: "Betatronix Inc", id: "00Qi000000gkLKC", num: "014"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Fernando+Zubiria+FM+Global", target: "Fernando Zubiria", company: "FM Global", id: "00Qi000000gkLKH", num: "015"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Miles+Ridgway+FBi+Buildings+Inc", target: "Miles Ridgway", company: "FBi Buildings Inc", id: "00Qi000000gkLKK", num: "016"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=robert+ernst+Auffenberg+Dealer+Group", target: "robert ernst", company: "Auffenberg Dealer Group", id: "00Qi000000gkLKL", num: "017"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Felicia+Madison+City+of+San+Antonio,+Texas", target: "Felicia Madison", company: "City of San Antonio, Texas", id: "00Qi000000gkLKQ", num: "018"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Patrick+Mccuen+DURA+Automotive+Systems", target: "Patrick Mccuen", company: "DURA Automotive Systems", id: "00Qi000000gkLKS", num: "019"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rudy+Detweiler+Elkay", target: "Rudy Detweiler", company: "Elkay", id: "00Qi000000gkLKd", num: "020"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sam+Lobue+Demag+Cranes+&+Components+Corp", target: "Sam Lobue", company: "Demag Cranes & Components Corp", id: "00Qi000000gkLKf", num: "021"} //,
    // {uri: "https://www.linkedin.com/sales/search?keywords=Lesley+Hwang+Chevron+Phillips+Chemical+Company", target: "Lesley Hwang", company: "Chevron Phillips Chemical Company", id: "00Qi000000gkLKg", num: "022"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=mike+O'Neill+Bay+Machine+&+Fabrication", target: "mike O'Neill", company: "Bay Machine & Fabrication", id: "00Qi000000gkLKj", num: "023"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Luke+Hart+NuCO2", target: "Luke Hart", company: "NuCO2", id: "00Qi000000gkOyZ", num: "024"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Tristian+mccallion+Edmonton+valve", target: "Tristian mccallion", company: "Edmonton valve", id: "00Qi000000gkPD7", num: "025"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Renee+hodges+Mortgage", target: "Renee hodges", company: "Mortgage", id: "00Qi000000gko0m", num: "026"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rita+Milks+B-LineLogic,+Inc.", target: "Rita Milks", company: "B-LineLogic, Inc.", id: "00Qi000000gkt9l", num: "027"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jessica+Bonetti+Avidia+Bank", target: "Jessica Bonetti", company: "Avidia Bank", id: "00Qi000000gl2D3", num: "028"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Bruce+Bortle+Don+Beyer+Motors+Inc", target: "Bruce Bortle", company: "Don Beyer Motors Inc", id: "00Qi000000gl2D5", num: "029"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Chad+Boyd+Cen-Tec+Systems+Inc", target: "Chad Boyd", company: "Cen-Tec Systems Inc", id: "00Qi000000gl2D9", num: "030"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Melissa+Jorgenson+Ariens+Co", target: "Melissa Jorgenson", company: "Ariens Co", id: "00Qi000000gl2DA", num: "031"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Len+Johnson+Cornell+University+Hosp-Animal", target: "Len Johnson", company: "Cornell University Hosp-Animal", id: "00Qi000000gl2DD", num: "032"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Leah+Brakke+Black+Gold+Farms", target: "Leah Brakke", company: "Black Gold Farms", id: "00Qi000000gl2DK", num: "033"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Cindy+Ayers+John+Deere+Company", target: "Cindy Ayers", company: "John Deere Company", id: "00Qi000000gl2DL", num: "034"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Efrat+Kashti-Lev+Elie+Tahari+Ltd", target: "Efrat Kashti-Lev", company: "Elie Tahari Ltd", id: "00Qi000000gl2DM", num: "035"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jen+Arnett+Juno+Online+Svc+Inc", target: "Jen Arnett", company: "Juno Online Svc Inc", id: "00Qi000000gl2DN", num: "036"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Michael+Armenta+Chumash+Casino", target: "Michael Armenta", company: "Chumash Casino", id: "00Qi000000gl2DR", num: "037"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sherri+Knieriem+Iu+Alumni+Association", target: "Sherri Knieriem", company: "Iu Alumni Association", id: "00Qi000000gl2DS", num: "038"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Warren+Ang+Eppendorf+Inc", target: "Warren Ang", company: "Eppendorf Inc", id: "00Qi000000gl2DU", num: "039"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Gina+Bertucci+Bushkill+Group+Inc", target: "Gina Bertucci", company: "Bushkill Group Inc", id: "00Qi000000gl2DZ", num: "040"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Stephen+Kenney+John+Hancock+Financial+Services", target: "Stephen Kenney", company: "John Hancock Financial Services", id: "00Qi000000gl2Dc", num: "041"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Eric+Beck+Mine+Safety+Appliances", target: "Eric Beck", company: "Mine Safety Appliances", id: "00Qi000000gl2De", num: "042"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=paula+kennon+Lane+Bryant+Inc", target: "paula kennon", company: "Lane Bryant Inc", id: "00Qi000000gl2Df", num: "043"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Misty+Barnes+Broen+Inc", target: "Misty Barnes", company: "Broen Inc", id: "00Qi000000gl2Dg", num: "044"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sandra+Bardsley+Kyokuyo", target: "Sandra Bardsley", company: "Kyokuyo", id: "00Qi000000gl2Di", num: "045"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jamie+Barn+Cornerstone+Heathcare", target: "Jamie Barn", company: "Cornerstone Heathcare", id: "00Qi000000gl2Dj", num: "046"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Melissa+Birdsall+Caesars+Entertainment+Corporation", target: "Melissa Birdsall", company: "Caesars Entertainment Corporation", id: "00Qi000000gl2Dk", num: "047"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rob+Bingenheimer+Kohls+Department+Stores", target: "Rob Bingenheimer", company: "Kohls Department Stores", id: "00Qi000000gl2Dl", num: "048"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Arron+Gillette+International+Newspaper+Ntwrk", target: "Arron Gillette", company: "International Newspaper Ntwrk", id: "00Qi000000gl2Dn", num: "049"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Cathy+Garrett+Jackson+Sun", target: "Cathy Garrett", company: "Jackson Sun", id: "00Qi000000gl2Do", num: "050"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Kelly+Garrett+KATC", target: "Kelly Garrett", company: "KATC", id: "00Qi000000gl2Dp", num: "051"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Marilyn+Garrard+First+Mid-Illinois+Bank+&+Trust", target: "Marilyn Garrard", company: "First Mid-Illinois Bank & Trust", id: "00Qi000000gl2Dq", num: "052"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Mistelle+Garcia+Dell+Inc", target: "Mistelle Garcia", company: "Dell Inc", id: "00Qi000000gl2Ds", num: "053"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sam+Ganarajah+Mens+Wearhouse+Inc", target: "Sam Ganarajah", company: "Mens Wearhouse Inc", id: "00Qi000000gl2Du", num: "054"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=joshua+banda+buckman+mitchell+inc", target: "joshua banda", company: "buckman mitchell inc", id: "00Qi000000gl2Dw", num: "055"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Kathy+Fuller+Crossroads+Rv+Inc", target: "Kathy Fuller", company: "Crossroads Rv Inc", id: "00Qi000000gl2Dx", num: "056"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Scott+Faland+Johnson+Controls+Inc", target: "Scott Faland", company: "Johnson Controls Inc", id: "00Qi000000gl2Dz", num: "057"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=janice+evans+Coxhealth", target: "janice evans", company: "Coxhealth", id: "00Qi000000gl2E1", num: "058"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Monica+Flores+IBC+Bank+/+International+Bank+of+Commerce", target: "Monica Flores", company: "IBC Bank / International Bank of Commerce", id: "00Qi000000gl2E3", num: "059"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Bill+Day+Loffredo+Fresh+Produce,+Inc.", target: "Bill Day", company: "Loffredo Fresh Produce, Inc.", id: "00Qi000000gl2EB", num: "060"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Greg+Elliott+Link+Manufacturing+Ltd", target: "Greg Elliott", company: "Link Manufacturing Ltd", id: "00Qi000000gl2EH", num: "061"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Mark+Breen+Dover+Flexo+Electronics+Inc", target: "Mark Breen", company: "Dover Flexo Electronics Inc", id: "00Qi000000gl2Ci", num: "062"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=henry+moseley+Marinemax+Inc", target: "henry moseley", company: "Marinemax Inc", id: "00Qi000000gl2Cn", num: "063"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Cherryl+Browsky+Card+Pak+Inc", target: "Cherryl Browsky", company: "Card Pak Inc", id: "00Qi000000gl2Cq", num: "064"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Kate+Buri+Mj+Electric+Inc", target: "Kate Buri", company: "Mj Electric Inc", id: "00Qi000000gl2Cs", num: "065"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=david+corr+Contech+Construction+Products+Inc", target: "david corr", company: "Contech Construction Products Inc", id: "00Qi000000gl2Eg", num: "066"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=David+Cohen+Nec+Display+Solutions", target: "David Cohen", company: "Nec Display Solutions", id: "00Qi000000gl2Ej", num: "067"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Joseph+D\'Amico+Experian", target: "Joseph D\'Amico", company: "Experian", id: "00Qi000000gl2Ek", num: "068"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Leslie+Craigle+East+Carolina+Universit...", target: "Leslie Craigle", company: "East Carolina Universit...", id: "00Qi000000gl2En", num: "069"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Michelle+Cazares+IDS+Engineering", target: "Michelle Cazares", company: "IDS Engineering", id: "00Qi000000gl2Eq", num: "070"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Tyler+Carlile+King+&+Prince+Seafood+Corp", target: "Tyler Carlile", company: "King & Prince Seafood Corp", id: "00Qi000000gl2Eu", num: "071"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Lynne+Christenson+Kentucky+Living+Magazine", target: "Lynne Christenson", company: "Kentucky Living Magazine", id: "00Qi000000gl2Ev", num: "072"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Bruce+Clapp+Epl+Inc", target: "Bruce Clapp", company: "Epl Inc", id: "00Qi000000gl2Ew", num: "073"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=John+Cloutier+Exmark+Manufacturing+Co+Inc", target: "John Cloutier", company: "Exmark Manufacturing Co Inc", id: "00Qi000000gl2Ex", num: "074"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Mark+Longacre+Jbt+Corporation", target: "Mark Longacre", company: "Jbt Corporation", id: "00Qi000000gl2F1", num: "075"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Pam+Logan+Marshall+Browning+Hospital", target: "Pam Logan", company: "Marshall Browning Hospital", id: "00Qi000000gl2F3", num: "076"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Fred+Krochmal+Cross+Country+Home+Services,+Inc.", target: "Fred Krochmal", company: "Cross Country Home Services, Inc.", id: "00Qi000000gl2F8", num: "077"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Lisa+Kubis+Figis+Inc", target: "Lisa Kubis", company: "Figis Inc", id: "00Qi000000gl2F9", num: "078"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=ashley+mangino+Marshall+Electronics+Inc", target: "ashley mangino", company: "Marshall Electronics Inc", id: "00Qi000000gl2FB", num: "079"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Flavio+Mantero+Microtech+Inc", target: "Flavio Mantero", company: "Microtech Inc", id: "00Qi000000gl2FD", num: "080"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=David+Maybe+Maola+Milk+Ice+Cream", target: "David Maybe", company: "Maola Milk Ice Cream", id: "00Qi000000gl2FM", num: "081"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jeremiah+Martin+Connecticut+Post", target: "Jeremiah Martin", company: "Connecticut Post", id: "00Qi000000gl2FO", num: "082"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Angie+Maxhimer+Mid+Continent+Cabinetry", target: "Angie Maxhimer", company: "Mid Continent Cabinetry", id: "00Qi000000gl2FR", num: "083"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sheryl+Hardt+Ixys+Corporation", target: "Sheryl Hardt", company: "Ixys Corporation", id: "00Qi000000gl2FS", num: "084"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jackie+Martin+News+Gazette", target: "Jackie Martin", company: "News Gazette", id: "00Qi000000gl2FT", num: "085"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=joe+martinez+Encon+Safety+Products", target: "joe martinez", company: "Encon Safety Products", id: "00Qi000000gl2FV", num: "086"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=marian+hagerman+Midwest+Medical+Insurance+Company", target: "marian hagerman", company: "Midwest Medical Insurance Company", id: "00Qi000000gl2FZ", num: "087"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sherilyn+Haddon+Forest+City", target: "Sherilyn Haddon", company: "Forest City", id: "00Qi000000gl2Fa", num: "088"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=greg+millman+Eagle+Asset+Management+Inc", target: "greg millman", company: "Eagle Asset Management Inc", id: "00Qi000000gl2Fe", num: "089"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Donna+Monchhour+CHA+Consulting,+Inc.", target: "Donna Monchhour", company: "CHA Consulting, Inc.", id: "00Qi000000gl2Ff", num: "090"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Bryce+Mccuin+Linger+Longer+Development+Reynolds+Plantation", target: "Bryce Mccuin", company: "Linger Longer Development Reynolds Plantation", id: "00Qi000000gl2Fg", num: "091"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Miriam+Metcalfe+Dexter+Magnetic+Technologies", target: "Miriam Metcalfe", company: "Dexter Magnetic Technologies", id: "00Qi000000gl2Fj", num: "092"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=David+Higdon+Functional+Pathways", target: "David Higdon", company: "Functional Pathways", id: "00Qi000000gl2Fn", num: "093"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Tim+Hillis+Cuny-Queensborough+Community+College", target: "Tim Hillis", company: "Cuny-Queensborough Community College", id: "00Qi000000gl2Fo", num: "094"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jake+Hebert+Innovia+Films,+Inc.", target: "Jake Hebert", company: "Innovia Films, Inc.", id: "00Qi000000gl2Fp", num: "095"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Ralph+Hays+Glenair+Inc", target: "Ralph Hays", company: "Glenair Inc", id: "00Qi000000gl2Fr", num: "096"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Pat+Hazan-tessler+E+J+Krause+And+Associates", target: "Pat Hazan-tessler", company: "E J Krause And Associates", id: "00Qi000000gl2Fs", num: "097"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Aaron+Hassel+Easton-Bell+Sports,+Inc...", target: "Aaron Hassel", company: "Easton-Bell Sports, Inc...", id: "00Qi000000gl2Fu", num: "098"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Michael+Motecalvo+Lamont+Awards+and+Apparel", target: "Michael Motecalvo", company: "Lamont Awards and Apparel", id: "00Qi000000gl2Fw", num: "099"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Aron+Myers+Florida+State+Universit...", target: "Aron Myers", company: "Florida State Universit...", id: "00Qi000000gl2Fy", num: "100"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Teresa+Brockman+Evergreen+Retirement+Community", target: "Teresa Brockman", company: "Evergreen Retirement Community", id: "00Qi000000gl2Fz", num: "101"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Dan+Morgan+Kamr-Tv+(Nbc+4)", target: "Dan Morgan", company: "Kamr-Tv (Nbc 4)", id: "00Qi000000gl2G0", num: "102"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Joe+Zaccari+Fgmk+Llc", target: "Joe Zaccari", company: "Fgmk Llc", id: "00Qi000000gl2G4", num: "103"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Gary+Rasso+Metropolitan+Medical+Lab+Plc", target: "Gary Rasso", company: "Metropolitan Medical Lab Plc", id: "00Qi000000gl2Ye", num: "104"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Bruce+Knight+Lighting+Resources+Inc", target: "Bruce Knight", company: "Lighting Resources Inc", id: "00Qi000000gl2XF", num: "105"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Tracey+Krayneski+Interim+Healthcare", target: "Tracey Krayneski", company: "Interim Healthcare", id: "00Qi000000gl2XI", num: "106"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Wesley+Willams+Consol+Energy+Inc", target: "Wesley Willams", company: "Consol Energy Inc", id: "00Qi000000gl2Yg", num: "107"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Laurie+Schirmer+Intrust+Financial+Corporation", target: "Laurie Schirmer", company: "Intrust Financial Corporation", id: "00Qi000000gl2XK", num: "108"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Dave+Truman+Mcm+Medical+Cost+Managment", target: "Dave Truman", company: "Mcm Medical Cost Managment", id: "00Qi000000gl2XN", num: "109"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Deborah+Schalm+Computershare", target: "Deborah Schalm", company: "Computershare", id: "00Qi000000gl2Y5", num: "110"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Krista+Wood+Marriott", target: "Krista Wood", company: "Marriott", id: "00Qi000000gl2Yk", num: "111"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Mary+Vineyard+Barry-Wehmiller+Companies+Inc", target: "Mary Vineyard", company: "Barry-Wehmiller Companies Inc", id: "00Qi000000gl2XS", num: "112"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Andrea+Ostapa+Kolcraft+Enterprises", target: "Andrea Ostapa", company: "Kolcraft Enterprises", id: "00Qi000000gl2Y7", num: "113"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Andrew+Smith+Diamond+Comic+Distributors+Inc", target: "Andrew Smith", company: "Diamond Comic Distributors Inc", id: "00Qi000000gl2Yn", num: "114"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Peter+vilks+Astro+Aerospace", target: "Peter vilks", company: "Astro Aerospace", id: "00Qi000000gl2XU", num: "115"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Heidi+Shalev+Covenant+Management+Systems+Lp", target: "Heidi Shalev", company: "Covenant Management Systems Lp", id: "00Qi000000gl2XW", num: "116"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Lynne+Snyder+B.+Braun+MEDICAL+INC", target: "Lynne Snyder", company: "B. Braun MEDICAL INC", id: "00Qi000000gl2YA", num: "117"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Debbie+Peterson+Data+2+Logistics+LLC", target: "Debbie Peterson", company: "Data 2 Logistics LLC", id: "00Qi000000gl2YE", num: "118"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=emily+parker+Disclosure+Save", target: "emily parker", company: "Disclosure Save", id: "00Qi000000gl2YF", num: "119"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Paul+Nielson+Destination+Cinema+Inc", target: "Paul Nielson", company: "Destination Cinema Inc", id: "00Qi000000gl2Xd", num: "120"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Hailey+Pitts+Kane+County+Chronicle+/+Shaw+Media", target: "Hailey Pitts", company: "Kane County Chronicle / Shaw Media", id: "00Qi000000gl2YH", num: "121"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=annie+phengsy+Manhiem+Georgia+Dealers+Auto+Auction", target: "annie phengsy", company: "Manhiem Georgia Dealers Auto Auction", id: "00Qi000000gl2YJ", num: "122"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Nicholas+Taiber+Cpm+Holdings+Inc", target: "Nicholas Taiber", company: "Cpm Holdings Inc", id: "00Qi000000gl2Xk", num: "123"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Dan+Thacker+Brook+Mays+Music+Co", target: "Dan Thacker", company: "Brook Mays Music Co", id: "00Qi000000gl2Xr", num: "124"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Claudine+Thorn+Core+Heathcare", target: "Claudine Thorn", company: "Core Heathcare", id: "00Qi000000gl2Xt", num: "125"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sherri+skellett+Martin+Agency", target: "Sherri skellett", company: "Martin Agency", id: "00Qi000000gl2YT", num: "126"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Kari+Tonsager+Minneapolis+Clinic", target: "Kari Tonsager", company: "Minneapolis Clinic", id: "00Qi000000gl2Xw", num: "127"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Violet+Slack+Bgf+Industries+Inc", target: "Violet Slack", company: "Bgf Industries Inc", id: "00Qi000000gl2YV", num: "128"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Dawn+Radecki+Meridian+Leasing+Corporation", target: "Dawn Radecki", company: "Meridian Leasing Corporation", id: "00Qi000000gl2YX", num: "129"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=bruce+robertson+Kaba+Ilco+Corp", target: "bruce robertson", company: "Kaba Ilco Corp", id: "00Qi000000gl2Xy", num: "130"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Julio+Ramirez+Jbs+Swift+&+Company", target: "Julio Ramirez", company: "Jbs Swift & Company", id: "00Qi000000gl2YZ", num: "131"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sharon+Sloan+Cooper+Cameron+Corp", target: "Sharon Sloan", company: "Cooper Cameron Corp", id: "00Qi000000gl2fN", num: "132"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Faith+Smith+Mercy+Hospital+Of+Defiance", target: "Faith Smith", company: "Mercy Hospital Of Defiance", id: "00Qi000000gl2fP", num: "133"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Ron+Anderson+Cardone+Industries", target: "Ron Anderson", company: "Cardone Industries", id: "00Qi000000gl2pJ", num: "134"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Harod+Kormos+Elma+Electronic+Inc.", target: "Harod Kormos", company: "Elma Electronic Inc.", id: "00Qi000000gl2pO", num: "135"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rui+Martins+Foster+Wheeler+AG", target: "Rui Martins", company: "Foster Wheeler AG", id: "00Qi000000gl2pR", num: "136"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Andrea+Przybyla+Integrative+Therapeutics", target: "Andrea Przybyla", company: "Integrative Therapeutics", id: "00Qi000000gl2pS", num: "137"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Keith+Miller+Castriota+Chevrolet+Inc.", target: "Keith Miller", company: "Castriota Chevrolet Inc.", id: "00Qi000000gl2pU", num: "138"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Vincent+Meinert+Cleveland+Brothers+Equipment+Co.+Inc", target: "Vincent Meinert", company: "Cleveland Brothers Equipment Co. Inc", id: "00Qi000000gl2pd", num: "139"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Bill+Montgomery+CEMEX", target: "Bill Montgomery", company: "CEMEX", id: "00Qi000000gl2po", num: "140"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Bhuvan+Singh+Makro", target: "Bhuvan Singh", company: "Makro", id: "00Qi000000gl2pr", num: "141"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Carol+Sheffler+Freddie+Mac", target: "Carol Sheffler", company: "Freddie Mac", id: "00Qi000000gl2py", num: "142"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Andrea+Stringhini+Ermenegildo+Zegna", target: "Andrea Stringhini", company: "Ermenegildo Zegna", id: "00Qi000000gl2q3", num: "143"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rhonda+Montgomery+Freddie+Mac", target: "Rhonda Montgomery", company: "Freddie Mac", id: "00Qi000000gl2q7", num: "144"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Anne (Willoughby)+Petry+Imperial+Manufacturing+Group", target: "Anne (Willoughby) Petry", company: "Imperial Manufacturing Group", id: "00Qi000000gl2qK", num: "145"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Madeline+Keane+Beltone+Corporation+N.A.", target: "Madeline Keane", company: "Beltone Corporation N.A.", id: "00Qi000000gl2qd", num: "146"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Cari+Carrillo+Astellia", target: "Cari Carrillo", company: "Astellia", id: "00Qi000000gl2ql", num: "147"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rachel+Ghiringhelli+fremont+toyota", target: "Rachel Ghiringhelli", company: "fremont toyota", id: "00Qi000000gl2qs", num: "148"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jacque+Beltran+Barneys+New+York", target: "Jacque Beltran", company: "Barneys New York", id: "00Qi000000gl2qu", num: "149"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Carlos+Diaz+Braman+Honda", target: "Carlos Diaz", company: "Braman Honda", id: "00Qi000000gl2uC", num: "150"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Aaron+Campbell+Kone+Corporation", target: "Aaron Campbell", company: "Kone Corporation", id: "00Qi000000gl2yv", num: "151"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Omer+Chicoine+Florida+Detroit+Diesel-Allison+Inc", target: "Omer Chicoine", company: "Florida Detroit Diesel-Allison Inc", id: "00Qi000000gl2yy", num: "152"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Lois+Brauckmuller+Florida+Community+College", target: "Lois Brauckmuller", company: "Florida Community College", id: "00Qi000000gl2z6", num: "153"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Fran+Brolley+Illinois+Valley+Community+College", target: "Fran Brolley", company: "Illinois Valley Community College", id: "00Qi000000gl2z7", num: "154"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=patrick+Ahern+Center+for+Computer+Forensics", target: "patrick Ahern", company: "Center for Computer Forensics", id: "00Qi000000gl2zC", num: "155"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Skip+Arok+Carrier+Enterprise+Llc", target: "Skip Arok", company: "Carrier Enterprise Llc", id: "00Qi000000gl2zL", num: "156"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Katherine+Armstrong+Englander", target: "Katherine Armstrong", company: "Englander", id: "00Qi000000gl2zM", num: "157"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Debbie+Bellamy+Lexisnexis+Group", target: "Debbie Bellamy", company: "Lexisnexis Group", id: "00Qi000000gl2zO", num: "158"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Laura+Beaudoin+Camelot+The+Golf+Club", target: "Laura Beaudoin", company: "Camelot The Golf Club", id: "00Qi000000gl2zT", num: "159"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=danny+baum+O+Reilly+Auto+Parts", target: "danny baum", company: "O Reilly Auto Parts", id: "00Qi000000gl2zU", num: "160"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Maria+Kalimnios+Lord+Abbett+&+Co", target: "Maria Kalimnios", company: "Lord Abbett & Co", id: "00Qi000000gl2za", num: "161"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Melissa+Jostand+Decker+Truck+Line+Inc", target: "Melissa Jostand", company: "Decker Truck Line Inc", id: "00Qi000000gl2zb", num: "162"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=jaime+jiminez+Baccarat+Inc", target: "jaime jiminez", company: "Baccarat Inc", id: "00Qi000000gl2zf", num: "163"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=jason+hope+JHM+Hotels", target: "jason hope", company: "JHM Hotels", id: "00Qi000000gl2zg", num: "164"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Richard+Arthur+Duke+Manufacturing+Company", target: "Richard Arthur", company: "Duke Manufacturing Company", id: "00Qi000000gl2zh", num: "165"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jeanne+Hesketh+Cbl+&+Associates+Properties+Inc", target: "Jeanne Hesketh", company: "Cbl & Associates Properties Inc", id: "00Qi000000gl2zi", num: "166"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Victoria+Harnish+Learning+Express+Inc", target: "Victoria Harnish", company: "Learning Express Inc", id: "00Qi000000gl2zk", num: "167"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Megan+Hall+Michigan+State+University", target: "Megan Hall", company: "Michigan State University", id: "00Qi000000gl2zl", num: "168"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Linda+Hall+Downtown+National+Motors", target: "Linda Hall", company: "Downtown National Motors", id: "00Qi000000gl2zm", num: "169"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Luanne+Hensley+Central+Moloney+Inc", target: "Luanne Hensley", company: "Central Moloney Inc", id: "00Qi000000gl2zr", num: "170"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Eric+Hauser+C+E+D", target: "Eric Hauser", company: "C E D", id: "00Qi000000gl2zs", num: "171"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Tony+Germano+Imperial+Distributors+Inc", target: "Tony Germano", company: "Imperial Distributors Inc", id: "00Qi000000gl2zv", num: "172"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Pat+Gray+Ntt+Data+Group", target: "Pat Gray", company: "Ntt Data Group", id: "00Qi000000gl2zz", num: "173"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Gary+Duvall+Arthur+J+Gallagher+&+Co", target: "Gary Duvall", company: "Arthur J Gallagher & Co", id: "00Qi000000gl307", num: "174"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=tina+fike+Best+Western+Inn", target: "tina fike", company: "Best Western Inn", id: "00Qi000000gl30C", num: "175"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Lynn+Deegan+Mississippi+Gulf+Coast+Cmnty", target: "Lynn Deegan", company: "Mississippi Gulf Coast Cmnty", id: "00Qi000000gl30G", num: "176"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Gayathri+Dinakaran+ISR+Info+Way+Inc", target: "Gayathri Dinakaran", company: "ISR Info Way Inc", id: "00Qi000000gl30I", num: "177"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jerry+Plumlee+Mobile+Community+Management+Co", target: "Jerry Plumlee", company: "Mobile Community Management Co", id: "00Qi000000gl30O", num: "178"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=katie+parks+Kemet+Corporation", target: "katie parks", company: "Kemet Corporation", id: "00Qi000000gl30S", num: "179"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Brooke+Westlake+Computerized+Screening+Inc.", target: "Brooke Westlake", company: "Computerized Screening Inc.", id: "00Qi000000gl32I", num: "180"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Bob+Zekis+Imperial+Distributors+Inc", target: "Bob Zekis", company: "Imperial Distributors Inc", id: "00Qi000000gl32J", num: "181"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Chris+Rizo+Discountmugscom+Company", target: "Chris Rizo", company: "Discountmugscom Company", id: "00Qi000000gl310", num: "182"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Walter+Sherbourne+Dayton+Parts+Llc", target: "Walter Sherbourne", company: "Dayton Parts Llc", id: "00Qi000000gl318", num: "183"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Dot+Schowe+East+Central+College", target: "Dot Schowe", company: "East Central College", id: "00Qi000000gl31A", num: "184"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sandra+Larsh+Cuttingham,+Chad+and+Hayes", target: "Sandra Larsh", company: "Cuttingham, Chad and Hayes", id: "00Qi000000gl31D", num: "185"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sandy+Sanford+Century+21", target: "Sandy Sanford", company: "Century 21", id: "00Qi000000gl31I", num: "186"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Linda+Knutson+Northland+Securities+Inc", target: "Linda Knutson", company: "Northland Securities Inc", id: "00Qi000000gl31N", num: "187"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Nicole+Sturznick+Lamarsh+And+Associates", target: "Nicole Sturznick", company: "Lamarsh And Associates", id: "00Qi000000gl31Q", num: "188"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=robin+stinnett+New+Horizon+Kids+Quest+Inc", target: "robin stinnett", company: "New Horizon Kids Quest Inc", id: "00Qi000000gl31X", num: "189"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Joanna+Stratman+Bavarian+Inn+Restaurant", target: "Joanna Stratman", company: "Bavarian Inn Restaurant", id: "00Qi000000gl31Y", num: "190"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Paul+Latiolais+Lamar+University-Beaumont", target: "Paul Latiolais", company: "Lamar University-Beaumont", id: "00Qi000000gl31e", num: "191"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jennifer+Lauerman+Mall+Of+America+Nickelodeon+Universe", target: "Jennifer Lauerman", company: "Mall Of America Nickelodeon Universe", id: "00Qi000000gl31f", num: "192"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Curt+Tueffert+Dxp+Enterprises+Inc", target: "Curt Tueffert", company: "Dxp Enterprises Inc", id: "00Qi000000gl31j", num: "193"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rick+Lunsford+Elkhorn+Construction", target: "Rick Lunsford", company: "Elkhorn Construction", id: "00Qi000000gl31m", num: "194"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Tate+Maddox+Employment+Screening+Services+Inc", target: "Tate Maddox", company: "Employment Screening Services Inc", id: "00Qi000000gl31o", num: "195"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Mike+Tigani+King+&+Prince+Seafood+Corp", target: "Mike Tigani", company: "King & Prince Seafood Corp", id: "00Qi000000gl31p", num: "196"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Naomi+Mccullock+Arthur+J+Gallagher+&+Co", target: "Naomi Mccullock", company: "Arthur J Gallagher & Co", id: "00Qi000000gl31s", num: "197"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=James+Mcfarlin+Mcfarlin+Group", target: "James Mcfarlin", company: "Mcfarlin Group", id: "00Qi000000gl31v", num: "198"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Janna+Madsen+D+C+Taylor+Co", target: "Janna Madsen", company: "D C Taylor Co", id: "00Qi000000gl320", num: "199"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Janet+Mclaren+Cruise+Planners", target: "Janet Mclaren", company: "Cruise Planners", id: "00Qi000000gl323", num: "200"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Chris+Mitchem+L&W+Supply", target: "Chris Mitchem", company: "L&W Supply", id: "00Qi000000gl327", num: "201"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Marcy+Morrison+California+State+University", target: "Marcy Morrison", company: "California State University", id: "00Qi000000gl32A", num: "202"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Glen+Nickerson+News+Sun", target: "Glen Nickerson", company: "News Sun", id: "00Qi000000gl32D", num: "203"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Brianne+Wildman+Industrial+Valve+Sales", target: "Brianne Wildman", company: "Industrial Valve Sales", id: "00Qi000000gl32E", num: "204"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Theresa+Yaw+Baldwin+Filters+Inc", target: "Theresa Yaw", company: "Baldwin Filters Inc", id: "00Qi000000gl32G", num: "205"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Heather+Wagoner+Kansas+State+University", target: "Heather Wagoner", company: "Kansas State University", id: "00Qi000000gl32H", num: "206"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Tony+Shubert+Eby-Brown+Company+LLC", target: "Tony Shubert", company: "Eby-Brown Company LLC", id: "00Qi000000gl39Z", num: "207"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Ben+Cast+Boston+Whaler+Inc", target: "Ben Cast", company: "Boston Whaler Inc", id: "00Qi000000gl39c", num: "208"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Kevin+Cooley+Frito+Lay", target: "Kevin Cooley", company: "Frito Lay", id: "00Qi000000gl39e", num: "209"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Greg+Said+Avaya+-+US", target: "Greg Said", company: "Avaya - US", id: "00Qi000000gl39j", num: "210"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Philippe+Pham+Emerson+Electric+Co.", target: "Philippe Pham", company: "Emerson Electric Co.", id: "00Qi000000gl39l", num: "211"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Glenn+Underwood+Ingenix", target: "Glenn Underwood", company: "Ingenix", id: "00Qi000000gl39y", num: "212"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Chad+Cioban+Cincinnati+Financial+Corporation", target: "Chad Cioban", company: "Cincinnati Financial Corporation", id: "00Qi000000gl39z", num: "213"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Bob+Plate+Dell", target: "Bob Plate", company: "Dell", id: "00Qi000000gl3A3", num: "214"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Robby+Bowen+CBS+RADIO+DALLAS", target: "Robby Bowen", company: "CBS RADIO DALLAS", id: "00Qi000000gl3A6", num: "215"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Shannon+Cistulli+Dilbeck+Realtors", target: "Shannon Cistulli", company: "Dilbeck Realtors", id: "00Qi000000gl3AA", num: "216"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rick+Paulson+Keeton's+Office+&+Art+Supply", target: "Rick Paulson", company: "Keeton's Office & Art Supply", id: "00Qi000000gl3AD", num: "217"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Andrew+Reinders+ING+U.S.", target: "Andrew Reinders", company: "ING U.S.", id: "00Qi000000gl3AO", num: "218"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Kristin+Koerner+MillerCoors", target: "Kristin Koerner", company: "MillerCoors", id: "00Qi000000gl3AV", num: "219"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Kevin+McRae+Food+Services+of+America-Spokane+branch", target: "Kevin McRae", company: "Food Services of America-Spokane branch", id: "00Qi000000gl3AZ", num: "220"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rich+McCormick+KONE", target: "Rich McCormick", company: "KONE", id: "00Qi000000gl3Aa", num: "221"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Cindy+Mercado+Maggiano's+Little+Italy", target: "Cindy Mercado", company: "Maggiano's Little Italy", id: "00Qi000000gl3Ad", num: "222"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Bart+Doerhoefer+Commonwealth+Bank+&+Trust+Company", target: "Bart Doerhoefer", company: "Commonwealth Bank & Trust Company", id: "00Qi000000gl3Qx", num: "223"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jim+Bordonaro+C+T+Corporation+Systems", target: "Jim Bordonaro", company: "C T Corporation Systems", id: "00Qi000000gl4EC", num: "224"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jon+Imperato+Maxim+Integrated+Products+Inc", target: "Jon Imperato", company: "Maxim Integrated Products Inc", id: "00Qi000000gl4ED", num: "225"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rich+Pucci+Cenveo+Labels+&+Packaging", target: "Rich Pucci", company: "Cenveo Labels & Packaging", id: "00Qi000000gl7Wo", num: "226"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sheryl+Rowe+Keller+Williams+Realty,+EG", target: "Sheryl Rowe", company: "Keller Williams Realty, EG", id: "00Qi000000glDnD", num: "227"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=RNT+[not entered]+ClearSlide", target: "RNT [not entered]", company: "ClearSlide", id: "00Qi000000glLJ2", num: "228"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Vic+Pariso+BrightBytes", target: "Vic Pariso", company: "BrightBytes", id: "00Qi000000glOvU", num: "229"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Peter+Daniels+dansc", target: "Peter Daniels", company: "dansc", id: "00Qi000000gldjf", num: "230"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Robert+Baldwin+TABS+Group", target: "Robert Baldwin", company: "TABS Group", id: "00Qi000000glfSo", num: "231"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Evan+Kincade+Listing+Booster", target: "Evan Kincade", company: "Listing Booster", id: "00Qi000000gm4lj", num: "232"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Russ+Cohn+Campanja", target: "Russ Cohn", company: "Campanja", id: "00Qi000000gm4u4", num: "233"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=John+Feldman+Cynergy+Technology", target: "John Feldman", company: "Cynergy Technology", id: "00Qi000000gm4ui", num: "234"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=David+A Bain+Sales+Linked", target: "David A Bain", company: "Sales Linked", id: "00Qi000000gm5x5", num: "235"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Rija+Najeeb+School", target: "Rija Najeeb", company: "School", id: "00Qi000000gm6Zt", num: "236"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Ravikumar+Raghavenderrao+NetEnrich+Inc", target: "Ravikumar Raghavenderrao", company: "NetEnrich Inc", id: "00Qi000000gm6bE", num: "237"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Louis+Mikal+EPFL", target: "Louis Mikal", company: "EPFL", id: "00Qi000000gm7EV", num: "238"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Eric+Miller+EF+Miller+Consulting", target: "Eric Miller", company: "EF Miller Consulting", id: "00Qi000000gm7Rc", num: "239"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Jamie+Cullinan+UCC", target: "Jamie Cullinan", company: "UCC", id: "00Qi000000gm7Tv", num: "240"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Gregory+Romondt+Tropical+Vision", target: "Gregory Romondt", company: "Tropical Vision", id: "00Qi000000gm7lB", num: "241"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Han+Nguyen+Colliers", target: "Han Nguyen", company: "Colliers", id: "00Qi000000gm7mv", num: "242"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Kathleen+Gaines+MarketingProfs", target: "Kathleen Gaines", company: "MarketingProfs", id: "00Qi000000gm7yu", num: "243"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Zaira+Panesh+Twitter,+Inc.", target: "Zaira Panesh", company: "Twitter, Inc.", id: "00Qi000000gm81S", num: "244"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=samuel+chun+Farmers+Insurance", target: "samuel chun", company: "Farmers Insurance", id: "00Qi000000gm862", num: "245"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Mihyun+Park+smca", target: "Mihyun Park", company: "smca", id: "00Qi000000gm87s", num: "246"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Sejun+Park+InMobi", target: "Sejun Park", company: "InMobi", id: "00Qi000000gm8Mf", num: "247"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Eric+Crawford+FireHouse+Church", target: "Eric Crawford", company: "FireHouse Church", id: "00Qi000000gm8O9", num: "248"},
    // {uri: "https://www.linkedin.com/sales/search?keywords=Diana+Bautista+Verint+Strategic+Accounts", target: "Diana Bautista", company: "Verint Strategic Accounts", id: "00Qi000000gm8n3", num: "249"}
];

casper.start(LI_LOGIN_URL, function () {'use strict';

this.echo('Logging in', 'debug');
this.fill('form', {
  'session_key': LI_LOGIN_USERNAME,
  'session_password': LI_LOGIN_PASSWORD
}, true);

this.echo('Logged in', 'debug');
}).each(links, function(self, link, index) {
  var usableUri = link.uri;
  var tmpFileName = link.num + "_" + link.target + "_" + link.company;
  var fileName = tmpFileName.replace(' ', '_');
  var searchTarget = link.target + ' ' + link.company;
  var leadName = link.target;
  var sfdcID = link.id;
  var searchTime = '';
  var num = link.num;
  var target_company = link.company;

  self.thenOpen(usableUri, function() {
    this.waitForSelector('h3.company-name > a', function() {
      this.capture('results/images/' + fileName + '.png');

      var results = this.evaluate(function() {
        var entityResults = {};

        var companyName = $('h3.company-name > a').text();
        var companyHref = 'https://www.linkedin.com' + $('h3.company-name > a').attr('href');
        var li_companyID = $('h3.company-name > a').attr('href').replace('/sales/accounts/insights?companyId=', '');
        var memberName = $('h1.member-name').text();
        var whereAmI = this.getCurrentUrl;

        entityResults.companyName = companyName;
        entityResults.companyHref = companyHref;
        entityResults.li_companyID = li_companyID;
        entityResults.li_profileName = memberName;
        entityResults.whereAmI = whereAmI;

        return entityResults;
      });

      var companyResults = {}; // the top-level object to hold the results of the searches
      // var reallyINeedThisAray = []; // the array that'll hold all these objects, essentially a wrapper

      companyResults.profile_page_info = results;
      companyResults.searchTarget = searchTarget;
      companyResults.leadName = leadName;
      companyResults.sfdcID = sfdcID;
      companyResults.searchTime = searchTime;
      companyResults.num = num;
      companyResults.target_company = target_company;

      var totalSet = JSON.stringify(companyResults, null, '    ');

      var jsonFileContents = fs.open('results/json/li_get_current_employer._v-0.2_EXPERIMENTAL.json', 'r');

      var jsonResults = jsonFileContents;

      var searchLength = links.length;

      if(index < 1) {
        // do something
        jsonResults = totalSet;
        fs.write('results/json/li_get_current_employer._v-0.2_EXPERIMENTAL.json', '[\n' + jsonResults, 'a');
        this.echo('Initiating File\nSearch length = ' + searchLength + '\n' + 'No: ' + (index + 1) + ', ' + colorizer.colorize('Name: ', 'INFO') + link.target + ', ' + colorizer.colorize('Company: ', 'INFO') + link.company + ', ' + colorizer.colorize('ID: ', 'INFO') + link.id);
      } else if(index < searchLength - 1) {
        // do something else
        jsonResults = totalSet;
        fs.write('results/json/li_get_current_employer._v-0.2_EXPERIMENTAL.json', ',\n' + jsonResults, 'a');
        this.echo('No: ' + (index + 1) + ', ' + colorizer.colorize('Name: ', 'INFO') + link.target + ', ' + colorizer.colorize('Company: ', 'INFO') + link.company + ', ' + colorizer.colorize('ID: ', 'INFO') + link.id);
      } else {
        jsonResults = totalSet;
          fs.write('results/json/li_get_current_employer._v-0.2_EXPERIMENTAL.json', ',\n' + jsonResults + '\n]', 'a');
        this.echo('No: ' + (index + 1) + ', ' + colorizer.colorize('Name: ', 'INFO') + link.target + ', ' + colorizer.colorize('Company: ', 'INFO') + link.company + ', ' + colorizer.colorize('ID: ', 'INFO') + link.id + '\nCompleting the file.....  \nGoodbye.\n');
      }// if li_get_current_employer._v-0.2_EXPERIMENTAL.json is empty then append a '[', else append a ',' plus the data
    }); // Wait for 'li.entity' to appear in the remote enviro, then grab the ul.results HTML, then write to file

  }); // Open each URI and set the remote context
}); // Iterate through each link in the 'links' array of objects

casper.run();
