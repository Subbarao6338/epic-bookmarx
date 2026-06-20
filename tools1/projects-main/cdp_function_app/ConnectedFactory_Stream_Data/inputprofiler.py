import pandas as pd
import joblib
import os
from word2number import w2n
import numpy as np
class inputprofiler(object):
    def s2n(self,value):
        try:
            x=eval(value)
            return x
        except:
            try:
                return w2n.word_to_num(value)
            except:
                return np.nan 
    def apply_profiler(self,df):
        df = df.replace(r'^\s*$', np.NaN, regex=True)
        if '85' in df.columns:
            df.drop(columns=['85'],inplace = True)
        if '157' in df.columns:
            df.drop(columns=['157'],inplace = True)
        if '158' in df.columns:
            df.drop(columns=['158'],inplace = True)
        if '220' in df.columns:
            df.drop(columns=['220'],inplace = True)
        if '292' in df.columns:
            df.drop(columns=['292'],inplace = True)
        if '293' in df.columns:
            df.drop(columns=['293'],inplace = True)
        if '358' in df.columns:
            df.drop(columns=['358'],inplace = True)
        if '492' in df.columns:
            df.drop(columns=['492'],inplace = True)
        if '440' in df.columns:
            df['440'] = df['440'].fillna(value='12.0859')
        if '516' in df.columns:
            df['516'] = df['516'].fillna(value='0.1747')
        if '166' in df.columns:
            df['166'] = df['166'].fillna(value='2.6')
        if '330' in df.columns:
            df['330'] = df['330'].fillna(value='0.0')
        if '122' in df.columns:
            df['122'] = df['122'].fillna(value='3.877')
        if '573' in df.columns:
            df['573'] = df['573'].fillna(value='0.2934')
        if '245' in df.columns:
            df['245'] = df['245'].fillna(value='1.1851')
        if '463' in df.columns:
            df['463'] = df['463'].fillna(value='0.0')
        if '142' in df.columns:
            df['142'] = df['142'].fillna(value='6.26')
        if '230' in df.columns:
            df['230'] = df['230'].fillna(value='0.0')
        if '576' in df.columns:
            df['576'] = df['576'].fillna(value='1.6245')
        if '503' in df.columns:
            df['503'] = df['503'].fillna(value='0.0')
        if '20' in df.columns:
            df['20'] = df['20'].fillna(value='1.406')
        if '312' in df.columns:
            df['312'] = df['312'].fillna(value='0.1215')
        if '347' in df.columns:
            df['347'] = df['347'].fillna(value='0.0')
        if '277' in df.columns:
            df['277'] = df['277'].fillna(value='2.0831')
        if '136' in df.columns:
            df['136'] = df['136'].fillna(value='134.6')
        if '384' in df.columns:
            df['384'] = df['384'].fillna(value='1.1063')
        if '400' in df.columns:
            df['400'] = df['400'].fillna(value='0.0')
        if 'Pass/Fail' in df.columns:
            df['Pass/Fail'] = df['Pass/Fail'].fillna(value='-1.0')
        if '536' in df.columns:
            df['536'] = df['536'].fillna(value='0.0')
        if '102' in df.columns:
            df['102'] = df['102'].fillna(value='0.0')
        if '438' in df.columns:
            df['438'] = df['438'].fillna(value='49.0909')
        if '47' in df.columns:
            df['47'] = df['47'].fillna(value='1.25105')
        if '202' in df.columns:
            df['202'] = df['202'].fillna(value='8.462')
        if '167' in df.columns:
            df['167'] = df['167'].fillna(value='1.2')
        if '518' in df.columns:
            df['518'] = df['518'].fillna(value='1.5891')
        if '572' in df.columns:
            df['572'] = df['572'].fillna(value='8.65')
        if '420' in df.columns:
            df['420'] = df['420'].fillna(value='1.6451')
        if '474' in df.columns:
            df['474'] = df['474'].fillna(value='32.820049999999995')
        if '494' in df.columns:
            df['494'] = df['494'].fillna(value='0.2325')
        if '240' in df.columns:
            df['240'] = df['240'].fillna(value='0.0')
        if '209' in df.columns:
            df['209'] = df['209'].fillna(value='0.0')
        if '33' in df.columns:
            df['33'] = df['33'].fillna(value='8.7698')
        if '217' in df.columns:
            df['217'] = df['217'].fillna(value='0.0617')
        if '182' in df.columns:
            df['182'] = df['182'].fillna(value='10.17')
        if '214' in df.columns:
            df['214'] = df['214'].fillna(value='0.0754')
        if '226' in df.columns:
            df['226'] = df['226'].fillna(value='0.0')
        if '581' in df.columns:
            df['581'] = df['581'].fillna(value='72.2889')
        if '191' in df.columns:
            df['191'] = df['191'].fillna(value='0.0')
        if '11' in df.columns:
            df['11'] = df['11'].fillna(value='0.9658')
        if '472' in df.columns:
            df['472'] = df['472'].fillna(value='138.25515000000001')
        if '390' in df.columns:
            df['390'] = df['390'].fillna(value='0.8773')
        if '120' in df.columns:
            df['120'] = df['120'].fillna(value='6.3136')
        if '334' in df.columns:
            df['334'] = df['334'].fillna(value='0.1294')
        if '173' in df.columns:
            df['173'] = df['173'].fillna(value='0.5776')
        if '300' in df.columns:
            df['300'] = df['300'].fillna(value='0.0828')
        if '407' in df.columns:
            df['407'] = df['407'].fillna(value='1.2397')
        if '236' in df.columns:
            df['236'] = df['236'].fillna(value='0.0')
        if '356' in df.columns:
            df['356'] = df['356'].fillna(value='1.2553')
        if '509' in df.columns:
            df['509'] = df['509'].fillna(value='0.0')
        if '100' in df.columns:
            df['100'] = df['100'].fillna(value='0.0')
        if '442' in df.columns:
            df['442'] = df['442'].fillna(value='1.2645499999999998')
        if '553' in df.columns:
            df['553'] = df['553'].fillna(value='7.4279')
        if '429' in df.columns:
            df['429'] = df['429'].fillna(value='3.4538')
        if '42' in df.columns:
            df['42'] = df['42'].fillna(value='70.0')
        if '194' in df.columns:
            df['194'] = df['194'].fillna(value='0.0')
        if '324' in df.columns:
            df['324'] = df['324'].fillna(value='12.5045')
        if '551' in df.columns:
            df['551'] = df['551'].fillna(value='1.15')
        if '385' in df.columns:
            df['385'] = df['385'].fillna(value='0.0068')
        if '273' in df.columns:
            df['273'] = df['273'].fillna(value='19.5809')
        if '529' in df.columns:
            df['529'] = df['529'].fillna(value='0.0')
        if '108' in df.columns:
            df['108'] = df['108'].fillna(value='-0.0112')
        if '548' in df.columns:
            df['548'] = df['548'].fillna(value='74.084')
        if '115' in df.columns:
            df['115'] = df['115'].fillna(value='750.8614')
        if '281' in df.columns:
            df['281'] = df['281'].fillna(value='0.0139')
        if '254' in df.columns:
            df['254'] = df['254'].fillna(value='0.015')
        if '363' in df.columns:
            df['363'] = df['363'].fillna(value='309.83164999999997')
        if '118' in df.columns:
            df['118'] = df['118'].fillna(value='0.599')
        if '231' in df.columns:
            df['231'] = df['231'].fillna(value='0.0')
        if '141' in df.columns:
            df['141'] = df['141'].fillna(value='0.0')
        if '332' in df.columns:
            df['332'] = df['332'].fillna(value='2.0627000000000004')
        if '114' in df.columns:
            df['114'] = df['114'].fillna(value='0.0')
        if '453' in df.columns:
            df['453'] = df['453'].fillna(value='5.2271')
        if '365' in df.columns:
            df['365'] = df['365'].fillna(value='0.0046')
        if '264' in df.columns:
            df['264'] = df['264'].fillna(value='0.0')
        if '401' in df.columns:
            df['401'] = df['401'].fillna(value='0.0')
        if '460' in df.columns:
            df['460'] = df['460'].fillna(value='26.16785')
        if '296' in df.columns:
            df['296'] = df['296'].fillna(value='1202.4121')
        if '523' in df.columns:
            df['523'] = df['523'].fillna(value='0.1')
        if '497' in df.columns:
            df['497'] = df['497'].fillna(value='10.90655')
        if '176' in df.columns:
            df['176'] = df['176'].fillna(value='0.2429')
        if '419' in df.columns:
            df['419'] = df['419'].fillna(value='272.4487')
        if '361' in df.columns:
            df['361'] = df['361'].fillna(value='39.6961')
        if '92' in df.columns:
            df['92'] = df['92'].fillna(value='0.0004')
        if '107' in df.columns:
            df['107'] = df['107'].fillna(value='0.0')
        if '545' in df.columns:
            df['545'] = df['545'].fillna(value='7.116')
        if '462' in df.columns:
            df['462'] = df['462'].fillna(value='0.0')
        if '495' in df.columns:
            df['495'] = df['495'].fillna(value='6.6079')
        if '448' in df.columns:
            df['448'] = df['448'].fillna(value='0.2512')
        if '63' in df.columns:
            df['63'] = df['63'].fillna(value='13.24605')
        if '237' in df.columns:
            df['237'] = df['237'].fillna(value='0.0')
        if '161' in df.columns:
            df['161'] = df['161'].fillna(value='2614.0')
        if '375' in df.columns:
            df['375'] = df['375'].fillna(value='0.0')
        if '355' in df.columns:
            df['355'] = df['355'].fillna(value='0.0294')
        if '386' in df.columns:
            df['386'] = df['386'].fillna(value='0.0068')
        if '294' in df.columns:
            df['294'] = df['294'].fillna(value='278.6719')
        if '310' in df.columns:
            df['310'] = df['310'].fillna(value='0.3029')
        if '345' in df.columns:
            df['345'] = df['345'].fillna(value='5.567')
        if '95' in df.columns:
            df['95'] = df['95'].fillna(value='0.0')
        if '0' in df.columns:
            df['0'] = df['0'].fillna(value='3011.49')
        if '207' in df.columns:
            df['207'] = df['207'].fillna(value='19.72')
        if '522' in df.columns:
            df['522'] = df['522'].fillna(value='13.7426')
        if '488' in df.columns:
            df['488'] = df['488'].fillna(value='348.5294')
        if '59' in df.columns:
            df['59'] = df['59'].fillna(value='0.9472499999999999')
        if '444' in df.columns:
            df['444'] = df['444'].fillna(value='0.9027000000000001')
        if '569' in df.columns:
            df['569'] = df['569'].fillna(value='16.98835')
        if '280' in df.columns:
            df['280'] = df['280'].fillna(value='0.0169')
        if '190' in df.columns:
            df['190'] = df['190'].fillna(value='0.0')
        if '435' in df.columns:
            df['435'] = df['435'].fillna(value='4.5511')
        if '198' in df.columns:
            df['198'] = df['198'].fillna(value='0.424')
        if '189' in df.columns:
            df['189'] = df['189'].fillna(value='0.0')
        if '241' in df.columns:
            df['241'] = df['241'].fillna(value='0.0')
        if '270' in df.columns:
            df['270'] = df['270'].fillna(value='28.7735')
        if '496' in df.columns:
            df['496'] = df['496'].fillna(value='22.0391')
        if '586' in df.columns:
            df['586'] = df['586'].fillna(value='0.0205')
        if '459' in df.columns:
            df['459'] = df['459'].fillna(value='2.83035')
        if '252' in df.columns:
            df['252'] = df['252'].fillna(value='2.8646')
        if '437' in df.columns:
            df['437'] = df['437'].fillna(value='3.7809')
        if '388' in df.columns:
            df['388'] = df['388'].fillna(value='32.5307')
        if '399' in df.columns:
            df['399'] = df['399'].fillna(value='0.0')
        if '28' in df.columns:
            df['28'] = df['28'].fillna(value='69.1556')
        if '86' in df.columns:
            df['86'] = df['86'].fillna(value='2.4039')
        if '325' in df.columns:
            df['325'] = df['325'].fillna(value='0.0')
        if '306' in df.columns:
            df['306'] = df['306'].fillna(value='0.0448')
        if '269' in df.columns:
            df['269'] = df['269'].fillna(value='3.7035')
        if '457' in df.columns:
            df['457'] = df['457'].fillna(value='4.79335')
        if '473' in df.columns:
            df['473'] = df['473'].fillna(value='34.24675')
        if '4' in df.columns:
            df['4'] = df['4'].fillna(value='1.3168')
        if '565' in df.columns:
            df['565'] = df['565'].fillna(value='0.11954999999999999')
        if '541' in df.columns:
            df['541'] = df['541'].fillna(value='9.4593')
        if '568' in df.columns:
            df['568'] = df['568'].fillna(value='1.9997')
        if '83' in df.columns:
            df['83'] = df['83'].fillna(value='7.4674499999999995')
        if '482' in df.columns:
            df['482'] = df['482'].fillna(value='293.5185')
        if '491' in df.columns:
            df['491'] = df['491'].fillna(value='2.2508')
        if '585' in df.columns:
            df['585'] = df['585'].fillna(value='2.75765')
        if '162' in df.columns:
            df['162'] = df['162'].fillna(value='1784.0')
        if '179' in df.columns:
            df['179'] = df['179'].fillna(value='0.0')
        if '507' in df.columns:
            df['507'] = df['507'].fillna(value='0.0')
        if '211' in df.columns:
            df['211'] = df['211'].fillna(value='0.0532')
        if '350' in df.columns:
            df['350'] = df['350'].fillna(value='0.0188')
        if '62' in df.columns:
            df['62'] = df['62'].fillna(value='116.2118')
        if '91' in df.columns:
            df['91'] = df['91'].fillna(value='0.0')
        if '260' in df.columns:
            df['260'] = df['260'].fillna(value='0.0')
        if '172' in df.columns:
            df['172'] = df['172'].fillna(value='0.32384999999999997')
        if '321' in df.columns:
            df['321'] = df['321'].fillna(value='2.07765')
        if '75' in df.columns:
            df['75'] = df['75'].fillna(value='-0.0063')
        if '224' in df.columns:
            df['224'] = df['224'].fillna(value='0.0398')
        if '380' in df.columns:
            df['380'] = df['380'].fillna(value='0.0')
        if '547' in df.columns:
            df['547'] = df['547'].fillna(value='403.122')
        if '570' in df.columns:
            df['570'] = df['570'].fillna(value='532.3982')
        if '359' in df.columns:
            df['359'] = df['359'].fillna(value='0.0196')
        if '421' in df.columns:
            df['421'] = df['421'].fillna(value='3.9431')
        if '377' in df.columns:
            df['377'] = df['377'].fillna(value='0.0015')
        if '336' in df.columns:
            df['336'] = df['336'].fillna(value='9.073550000000001')
        if '381' in df.columns:
            df['381'] = df['381'].fillna(value='0.0')
        if '203' in df.columns:
            df['203'] = df['203'].fillna(value='30.097')
        if '436' in df.columns:
            df['436'] = df['436'].fillna(value='2.7643')
        if '290' in df.columns:
            df['290'] = df['290'].fillna(value='0.0833')
        if '304' in df.columns:
            df['304'] = df['304'].fillna(value='0.1372')
        if '455' in df.columns:
            df['455'] = df['455'].fillna(value='3.7245')
        if '562' in df.columns:
            df['562'] = df['562'].fillna(value='264.272')
        if '578' in df.columns:
            df['578'] = df['578'].fillna(value='0.0204')
        if '471' in df.columns:
            df['471'] = df['471'].fillna(value='7.396')
        if '480' in df.columns:
            df['480'] = df['480'].fillna(value='70.4345')
        if '109' in df.columns:
            df['109'] = df['109'].fillna(value='0.981')
        if '41' in df.columns:
            df['41'] = df['41'].fillna(value='3.074')
        if '526' in df.columns:
            df['526'] = df['526'].fillna(value='1.5501')
        if '134' in df.columns:
            df['134'] = df['134'].fillna(value='38.9026')
        if '532' in df.columns:
            df['532'] = df['532'].fillna(value='0.0')
        if '225' in df.columns:
            df['225'] = df['225'].fillna(value='967.2998')
        if '549' in df.columns:
            df['549'] = df['549'].fillna(value='0.471')
        if '456' in df.columns:
            df['456'] = df['456'].fillna(value='11.3509')
        if '580' in df.columns:
            df['580'] = df['580'].fillna(value='0.0047')
        if '267' in df.columns:
            df['267'] = df['267'].fillna(value='0.0706')
        if '376' in df.columns:
            df['376'] = df['376'].fillna(value='0.0016')
        if '117' in df.columns:
            df['117'] = df['117'].fillna(value='58.5491')
        if '171' in df.columns:
            df['171'] = df['171'].fillna(value='0.1125')
        if '135' in df.columns:
            df['135'] = df['135'].fillna(value='109.0')
        if '153' in df.columns:
            df['153'] = df['153'].fillna(value='0.0111')
        if '256' in df.columns:
            df['256'] = df['256'].fillna(value='0.0')
        if '67' in df.columns:
            df['67'] = df['67'].fillna(value='0.9783')
        if '227' in df.columns:
            df['227'] = df['227'].fillna(value='0.0165')
        if '343' in df.columns:
            df['343'] = df['343'].fillna(value='6.0056')
        if '427' in df.columns:
            df['427'] = df['427'].fillna(value='3.94145')
        if '340' in df.columns:
            df['340'] = df['340'].fillna(value='0.0464')
        if '145' in df.columns:
            df['145'] = df['145'].fillna(value='0.0586')
        if '584' in df.columns:
            df['584'] = df['584'].fillna(value='0.0036')
        if '89' in df.columns:
            df['89'] = df['89'].fillna(value='0.1901')
        if '557' in df.columns:
            df['557'] = df['557'].fillna(value='1.5298')
        if '222' in df.columns:
            df['222'] = df['222'].fillna(value='0.0023')
        if '418' in df.columns:
            df['418'] = df['418'].fillna(value='302.1776')
        if '531' in df.columns:
            df['531'] = df['531'].fillna(value='0.0')
        if '530' in df.columns:
            df['530'] = df['530'].fillna(value='0.0')
        if '278' in df.columns:
            df['278'] = df['278'].fillna(value='0.0011')
        if '352' in df.columns:
            df['352'] = df['352'].fillna(value='0.022')
        if '298' in df.columns:
            df['298'] = df['298'].fillna(value='0.0528')
        if '499' in df.columns:
            df['499'] = df['499'].fillna(value='0.0')
        if '449' in df.columns:
            df['449'] = df['449'].fillna(value='0.0')
        if '199' in df.columns:
            df['199'] = df['199'].fillna(value='8.57')
        if '378' in df.columns:
            df['378'] = df['378'].fillna(value='0.0')
        if '371' in df.columns:
            df['371'] = df['371'].fillna(value='0.0')
        if '398' in df.columns:
            df['398'] = df['398'].fillna(value='0.0')
        if '257' in df.columns:
            df['257'] = df['257'].fillna(value='0.0')
        if '84' in df.columns:
            df['84'] = df['84'].fillna(value='0.133')
        if '40' in df.columns:
            df['40'] = df['40'].fillna(value='78.29')
        if '188' in df.columns:
            df['188'] = df['188'].fillna(value='40.209500000000006')
        if '126' in df.columns:
            df['126'] = df['126'].fillna(value='2.735')
        if '184' in df.columns:
            df['184'] = df['184'].fillna(value='0.1326')
        if '275' in df.columns:
            df['275'] = df['275'].fillna(value='0.0784')
        if '559' in df.columns:
            df['559'] = df['559'].fillna(value='0.2909')
        if '525' in df.columns:
            df['525'] = df['525'].fillna(value='5.1342')
        if '263' in df.columns:
            df['263'] = df['263'].fillna(value='0.0')
        if '219' in df.columns:
            df['219'] = df['219'].fillna(value='0.003')
        if '52' in df.columns:
            df['52'] = df['52'].fillna(value='0.0')
        if '387' in df.columns:
            df['387'] = df['387'].fillna(value='0.0')
        if '392' in df.columns:
            df['392'] = df['392'].fillna(value='0.0049')
        if '103' in df.columns:
            df['103'] = df['103'].fillna(value='-0.0101')
        if '587' in df.columns:
            df['587'] = df['587'].fillna(value='0.0148')
        if '307' in df.columns:
            df['307'] = df['307'].fillna(value='0.1295')
        if '21' in df.columns:
            df['21'] = df['21'].fillna(value='-5523.25')
        if '249' in df.columns:
            df['249'] = df['249'].fillna(value='0.0')
        if '150' in df.columns:
            df['150'] = df['150'].fillna(value='5.9510000000000005')
        if '566' in df.columns:
            df['566'] = df['566'].fillna(value='2.15045')
        if '318' in df.columns:
            df['318'] = df['318'].fillna(value='2.8989000000000003')
        if '315' in df.columns:
            df['315'] = df['315'].fillna(value='0.0')
        if '60' in df.columns:
            df['60'] = df['60'].fillna(value='353.7991')
        if '180' in df.columns:
            df['180'] = df['180'].fillna(value='18.69')
        if '348' in df.columns:
            df['348'] = df['348'].fillna(value='0.0226')
        if '192' in df.columns:
            df['192'] = df['192'].fillna(value='0.0')
        if '139' in df.columns:
            df['139'] = df['139'].fillna(value='339.561')
        if '29' in df.columns:
            df['29'] = df['29'].fillna(value='2.3778')
        if '370' in df.columns:
            df['370'] = df['370'].fillna(value='0.0')
        if '308' in df.columns:
            df['308'] = df['308'].fillna(value='0.21945')
        if '558' in df.columns:
            df['558'] = df['558'].fillna(value='0.9727')
        if '556' in df.columns:
            df['556'] = df['556'].fillna(value='4.0671')
        if '520' in df.columns:
            df['520'] = df['520'].fillna(value='2.221')
        if '465' in df.columns:
            df['465'] = df['465'].fillna(value='0.0')
        if '196' in df.columns:
            df['196'] = df['196'].fillna(value='6.78')
        if '185' in df.columns:
            df['185'] = df['185'].fillna(value='6.735')
        if '544' in df.columns:
            df['544'] = df['544'].fillna(value='0.0026')
        if '406' in df.columns:
            df['406'] = df['406'].fillna(value='5.9201')
        if '561' in df.columns:
            df['561'] = df['561'].fillna(value='29.73115')
        if '305' in df.columns:
            df['305'] = df['305'].fillna(value='0.2643')
        if '72' in df.columns:
            df['72'] = df['72'].fillna(value='152.2972')
        if '183' in df.columns:
            df['183'] = df['183'].fillna(value='27.200499999999998')
        if '554' in df.columns:
            df['554'] = df['554'].fillna(value='0.4789')
        if '186' in df.columns:
            df['186'] = df['186'].fillna(value='0.0')
        if '326' in df.columns:
            df['326'] = df['326'].fillna(value='0.0')
        if '97' in df.columns:
            df['97'] = df['97'].fillna(value='0.0')
        if '2' in df.columns:
            df['2'] = df['2'].fillna(value='2201.0667')
        if '93' in df.columns:
            df['93'] = df['93'].fillna(value='-0.0002')
        if '510' in df.columns:
            df['510'] = df['510'].fillna(value='46.9861')
        if '295' in df.columns:
            df['295'] = df['295'].fillna(value='195.8256')
        if '521' in df.columns:
            df['521'] = df['521'].fillna(value='0.0')
        if '261' in df.columns:
            df['261'] = df['261'].fillna(value='0.0')
        if '14' in df.columns:
            df['14'] = df['14'].fillna(value='8.966999999999999')
        if '367' in df.columns:
            df['367'] = df['367'].fillna(value='0.0032')
        if '575' in df.columns:
            df['575'] = df['575'].fillna(value='0.0895')
        if '430' in df.columns:
            df['430'] = df['430'].fillna(value='11.1056')
        if '413' in df.columns:
            df['413'] = df['413'].fillna(value='20.2551')
        if '362' in df.columns:
            df['362'] = df['362'].fillna(value='0.0125')
        if '187' in df.columns:
            df['187'] = df['187'].fillna(value='17.865000000000002')
        if '331' in df.columns:
            df['331'] = df['331'].fillna(value='0.0848')
        if '335' in df.columns:
            df['335'] = df['335'].fillna(value='2.5135')
        if '506' in df.columns:
            df['506'] = df['506'].fillna(value='0.0')
        if '416' in df.columns:
            df['416'] = df['416'].fillna(value='3.234')
        if '487' in df.columns:
            df['487'] = df['487'].fillna(value='112.2755')
        if '129' in df.columns:
            df['129'] = df['129'].fillna(value='-0.1419')
        if '538' in df.columns:
            df['538'] = df['538'].fillna(value='0.0')
        if '486' in df.columns:
            df['486'] = df['486'].fillna(value='249.927')
        if '327' in df.columns:
            df['327'] = df['327'].fillna(value='0.0')
        if '567' in df.columns:
            df['567'] = df['567'].fillna(value='0.04865')
        if '262' in df.columns:
            df['262'] = df['262'].fillna(value='0.0')
        if '393' in df.columns:
            df['393'] = df['393'].fillna(value='0.1339')
        if '248' in df.columns:
            df['248'] = df['248'].fillna(value='0.021')
        if '229' in df.columns:
            df['229'] = df['229'].fillna(value='0.0')
        if '239' in df.columns:
            df['239'] = df['239'].fillna(value='0.0044')
        if '282' in df.columns:
            df['282'] = df['282'].fillna(value='0.0053')
        if '289' in df.columns:
            df['289'] = df['289'].fillna(value='2.5490000000000004')
        if '299' in df.columns:
            df['299'] = df['299'].fillna(value='0.04')
        if '238' in df.columns:
            df['238'] = df['238'].fillna(value='0.0046')
        if '170' in df.columns:
            df['170'] = df['170'].fillna(value='0.686')
        if '272' in df.columns:
            df['272'] = df['272'].fillna(value='40.01925')
        if '149' in df.columns:
            df['149'] = df['149'].fillna(value='0.0')
        if '19' in df.columns:
            df['19'] = df['19'].fillna(value='12.4996')
        if '484' in df.columns:
            df['484'] = df['484'].fillna(value='138.7755')
        if '297' in df.columns:
            df['297'] = df['297'].fillna(value='820.0988')
        if '552' in df.columns:
            df['552'] = df['552'].fillna(value='0.1979')
        if '354' in df.columns:
            df['354'] = df['354'].fillna(value='0.0442')
        if '287' in df.columns:
            df['287'] = df['287'].fillna(value='0.13895000000000002')
        if '346' in df.columns:
            df['346'] = df['346'].fillna(value='3.0464')
        if '319' in df.columns:
            df['319'] = df['319'].fillna(value='8.3888')
        if '341' in df.columns:
            df['341'] = df['341'].fillna(value='2.3773')
        if '169' in df.columns:
            df['169'] = df['169'].fillna(value='0.412')
        if '303' in df.columns:
            df['303'] = df['303'].fillna(value='0.0388')
        if '205' in df.columns:
            df['205'] = df['205'].fillna(value='7.74')
        if '475' in df.columns:
            df['475'] = df['475'].fillna(value='4.2762')
        if '589' in df.columns:
            df['589'] = df['589'].fillna(value='71.9005')
        if '333' in df.columns:
            df['333'] = df['333'].fillna(value='5.9801')
        if '138' in df.columns:
            df['138'] = df['138'].fillna(value='55.9001')
        if '276' in df.columns:
            df['276'] = df['276'].fillna(value='0.0')
        if '24' in df.columns:
            df['24'] = df['24'].fillna(value='-78.75')
        if '90' in df.columns:
            df['90'] = df['90'].fillna(value='8825.435099999999')
        if '78' in df.columns:
            df['78'] = df['78'].fillna(value='-0.0125')
        if '577' in df.columns:
            df['577'] = df['577'].fillna(value='13.8179')
        if '563' in df.columns:
            df['563'] = df['563'].fillna(value='0.651')
        if '450' in df.columns:
            df['450'] = df['450'].fillna(value='0.0')
        if '528' in df.columns:
            df['528'] = df['528'].fillna(value='0.0')
        if '3' in df.columns:
            df['3'] = df['3'].fillna(value='1285.2144')
        if '23' in df.columns:
            df['23'] = df['23'].fillna(value='-3820.75')
        if '200' in df.columns:
            df['200'] = df['200'].fillna(value='17.235')
        if '468' in df.columns:
            df['468'] = df['468'].fillna(value='150.3401')
        if '391' in df.columns:
            df['391'] = df['391'].fillna(value='0.0102')
        if '417' in df.columns:
            df['417'] = df['417'].fillna(value='7.3956')
        if '329' in df.columns:
            df['329'] = df['329'].fillna(value='0.0')
        if '88' in df.columns:
            df['88'] = df['88'].fillna(value='1809.2492')
        if '542' in df.columns:
            df['542'] = df['542'].fillna(value='0.1096')
        if '143' in df.columns:
            df['143'] = df['143'].fillna(value='0.0039')
        if '582' in df.columns:
            df['582'] = df['582'].fillna(value='0.5002')
        if '517' in df.columns:
            df['517'] = df['517'].fillna(value='1.1543')
        if '79' in df.columns:
            df['79'] = df['79'].fillna(value='0.0006')
        if '535' in df.columns:
            df['535'] = df['535'].fillna(value='0.0')
        if '539' in df.columns:
            df['539'] = df['539'].fillna(value='3.0548')
        if '560' in df.columns:
            df['560'] = df['560'].fillna(value='0.0592')
        if '373' in df.columns:
            df['373'] = df['373'].fillna(value='0.0')
        if '409' in df.columns:
            df['409'] = df['409'].fillna(value='4.4897')
        if '508' in df.columns:
            df['508'] = df['508'].fillna(value='0.0')
        if '232' in df.columns:
            df['232'] = df['232'].fillna(value='0.0')
        if '443' in df.columns:
            df['443'] = df['443'].fillna(value='0.6435')
        if '71' in df.columns:
            df['71'] = df['71'].fillna(value='102.6043')
        if '477' in df.columns:
            df['477'] = df['477'].fillna(value='5.2422')
        if '502' in df.columns:
            df['502'] = df['502'].fillna(value='0.0')
        if '320' in df.columns:
            df['320'] = df['320'].fillna(value='0.03985')
        if '253' in df.columns:
            df['253'] = df['253'].fillna(value='0.0308')
        if '259' in df.columns:
            df['259'] = df['259'].fillna(value='0.0')
        if '415' in df.columns:
            df['415'] = df['415'].fillna(value='6.1766')
        if '422' in df.columns:
            df['422'] = df['422'].fillna(value='0.0')
        if '395' in df.columns:
            df['395'] = df['395'].fillna(value='0.0')
        if '447' in df.columns:
            df['447'] = df['447'].fillna(value='0.2797')
        if '511' in df.columns:
            df['511'] = df['511'].fillna(value='0.0')
        if '500' in df.columns:
            df['500'] = df['500'].fillna(value='0.0')
        if '357' in df.columns:
            df['357'] = df['357'].fillna(value='0.0009')
        if '411' in df.columns:
            df['411'] = df['411'].fillna(value='2.5481')
        if '583' in df.columns:
            df['583'] = df['583'].fillna(value='0.0138')
        if '402' in df.columns:
            df['402'] = df['402'].fillna(value='0.0')
        if '342' in df.columns:
            df['342'] = df['342'].fillna(value='0.0')
        if '314' in df.columns:
            df['314'] = df['314'].fillna(value='0.0')
        if '10' in df.columns:
            df['10'] = df['10'].fillna(value='0.0004')
        if '328' in df.columns:
            df['328'] = df['328'].fillna(value='0.0')
        if '266' in df.columns:
            df['266'] = df['266'].fillna(value='0.0')
        if '412' in df.columns:
            df['412'] = df['412'].fillna(value='26.1569')
        if '405' in df.columns:
            df['405'] = df['405'].fillna(value='0.0239')
        if '25' in df.columns:
            df['25'] = df['25'].fillna(value='1.283')
        if '286' in df.columns:
            df['286'] = df['286'].fillna(value='3.36005')
        if '469' in df.columns:
            df['469'] = df['469'].fillna(value='5.4724')
        if '524' in df.columns:
            df['524'] = df['524'].fillna(value='4.8771')
        if '271' in df.columns:
            df['271'] = df['271'].fillna(value='45.6765')
        if '478' in df.columns:
            df['478'] = df['478'].fillna(value='0.0')
        if '309' in df.columns:
            df['309'] = df['309'].fillna(value='0.1295')
        if '461' in df.columns:
            df['461'] = df['461'].fillna(value='0.0')
        if '234' in df.columns:
            df['234'] = df['234'].fillna(value='0.0')
        if '489' in df.columns:
            df['489'] = df['489'].fillna(value='219.4872')
        if '360' in df.columns:
            df['360'] = df['360'].fillna(value='0.0007')
        if '246' in df.columns:
            df['246'] = df['246'].fillna(value='3.673')
        if '470' in df.columns:
            df['470'] = df['470'].fillna(value='4.0611')
        if '233' in df.columns:
            df['233'] = df['233'].fillna(value='0.0')
        if '534' in df.columns:
            df['534'] = df['534'].fillna(value='0.0')
        if '201' in df.columns:
            df['201'] = df['201'].fillna(value='6.76')
        if '243' in df.columns:
            df['243'] = df['243'].fillna(value='0.0')
        if '382' in df.columns:
            df['382'] = df['382'].fillna(value='0.0005')
        if '195' in df.columns:
            df['195'] = df['195'].fillna(value='0.259')
        if '540' in df.columns:
            df['540'] = df['540'].fillna(value='1.7855')
        if '458' in df.columns:
            df['458'] = df['458'].fillna(value='0.0')
        if '364' in df.columns:
            df['364'] = df['364'].fillna(value='0.0')
        if '113' in df.columns:
            df['113'] = df['113'].fillna(value='0.9464')
        if '479' in df.columns:
            df['479'] = df['479'].fillna(value='3.1845')
        if '255' in df.columns:
            df['255'] = df['255'].fillna(value='0.4051')
        if '144' in df.columns:
            df['144'] = df['144'].fillna(value='0.1075')
        if '1' in df.columns:
            df['1'] = df['1'].fillna(value='2499.4049999999997')
        if '178' in df.columns:
            df['178'] = df['178'].fillna(value='0.0')
        if '434' in df.columns:
            df['434'] = df['434'].fillna(value='10.1977')
        if '279' in df.columns:
            df['279'] = df['279'].fillna(value='0.0372')
        if '32' in df.columns:
            df['32'] = df['32'].fillna(value='85.13544999999999')
        if '81' in df.columns:
            df['81'] = df['81'].fillna(value='-0.0196')
        if '235' in df.columns:
            df['235'] = df['235'].fillna(value='0.0')
        if '302' in df.columns:
            df['302'] = df['302'].fillna(value='0.3808')
        if '313' in df.columns:
            df['313'] = df['313'].fillna(value='0.0')
        if '156' in df.columns:
            df['156'] = df['156'].fillna(value='0.0487')
        if '268' in df.columns:
            df['268'] = df['268'].fillna(value='17.977')
        if '94' in df.columns:
            df['94'] = df['94'].fillna(value='0.0')
        if '244' in df.columns:
            df['244'] = df['244'].fillna(value='0.0017')
        if '433' in df.columns:
            df['433'] = df['433'].fillna(value='151.1156')
        if '512' in df.columns:
            df['512'] = df['512'].fillna(value='0.0')
        if '564' in df.columns:
            df['564'] = df['564'].fillna(value='5.16')
        if '424' in df.columns:
            df['424'] = df['424'].fillna(value='2.6671')
        if '394' in df.columns:
            df['394'] = df['394'].fillna(value='0.0')
        if '579' in df.columns:
            df['579'] = df['579'].fillna(value='0.0148')
        if '159' in df.columns:
            df['159'] = df['159'].fillna(value='623.0')
        if '64' in df.columns:
            df['64'] = df['64'].fillna(value='20.021349999999998')
        if '527' in df.columns:
            df['527'] = df['527'].fillna(value='6.4108')
        if '215' in df.columns:
            df['215'] = df['215'].fillna(value='0.0825')
        if '351' in df.columns:
            df['351'] = df['351'].fillna(value='0.0253')
        if '223' in df.columns:
            df['223'] = df['223'].fillna(value='119.436')
        if '515' in df.columns:
            df['515'] = df['515'].fillna(value='0.0')
        if '408' in df.columns:
            df['408'] = df['408'].fillna(value='4.9224499999999995')
        if '441' in df.columns:
            df['441'] = df['441'].fillna(value='0.8076')
        if '53' in df.columns:
            df['53'] = df['53'].fillna(value='4.596')
        if '112' in df.columns:
            df['112'] = df['112'].fillna(value='0.46285')
        if '251' in df.columns:
            df['251'] = df['251'].fillna(value='0.001')
        if '396' in df.columns:
            df['396'] = df['396'].fillna(value='0.0')
        if '452' in df.columns:
            df['452'] = df['452'].fillna(value='5.27145')
        if '155' in df.columns:
            df['155'] = df['155'].fillna(value='0.32')
        if '258' in df.columns:
            df['258'] = df['258'].fillna(value='0.0')
        if '311' in df.columns:
            df['311'] = df['311'].fillna(value='0.0977')
        if '368' in df.columns:
            df['368'] = df['368'].fillna(value='0.0028')
        if '505' in df.columns:
            df['505'] = df['505'].fillna(value='0.0')
        if '485' in df.columns:
            df['485'] = df['485'].fillna(value='112.9534')
        if '574' in df.columns:
            df['574'] = df['574'].fillna(value='2.9758')
        if '432' in df.columns:
            df['432'] = df['432'].fillna(value='57.9693')
        if '208' in df.columns:
            df['208'] = df['208'].fillna(value='73.248')
        if '426' in df.columns:
            df['426'] = df['426'].fillna(value='1.1353')
        if '454' in df.columns:
            df['454'] = df['454'].fillna(value='7.4249')
        if '339' in df.columns:
            df['339'] = df['339'].fillna(value='9.4742')
        if '397' in df.columns:
            df['397'] = df['397'].fillna(value='0.0')
        if '265' in df.columns:
            df['265'] = df['265'].fillna(value='0.0')
        if '284' in df.columns:
            df['284'] = df['284'].fillna(value='0.0')
        if '285' in df.columns:
            df['285'] = df['285'].fillna(value='1.87515')
        if '213' in df.columns:
            df['213'] = df['213'].fillna(value='0.056')
        if '31' in df.columns:
            df['31'] = df['31'].fillna(value='3.431')
        if '74' in df.columns:
            df['74'] = df['74'].fillna(value='0.0')
        if '445' in df.columns:
            df['445'] = df['445'].fillna(value='0.6511')
        if '301' in df.columns:
            df['301'] = df['301'].fillna(value='0.8604')
        if '99' in df.columns:
            df['99'] = df['99'].fillna(value='0.0')
        if '404' in df.columns:
            df['404'] = df['404'].fillna(value='0.0')
        if '425' in df.columns:
            df['425'] = df['425'].fillna(value='4.7644')
        if '431' in df.columns:
            df['431'] = df['431'].fillna(value='16.381')
        if '160' in df.columns:
            df['160'] = df['160'].fillna(value='438.0')
        if '218' in df.columns:
            df['218'] = df['218'].fillna(value='3.63075')
        if '337' in df.columns:
            df['337'] = df['337'].fillna(value='2.05445')
        if '193' in df.columns:
            df['193'] = df['193'].fillna(value='0.0')
        if '446' in df.columns:
            df['446'] = df['446'].fillna(value='1.1638')
        if '369' in df.columns:
            df['369'] = df['369'].fillna(value='0.0')
        if '8' in df.columns:
            df['8'] = df['8'].fillna(value='1.4616')
        if '283' in df.columns:
            df['283'] = df['283'].fillna(value='2.658')
        if '349' in df.columns:
            df['349'] = df['349'].fillna(value='0.024')
        if '338' in df.columns:
            df['338'] = df['338'].fillna(value='2.5608500000000003')
        if '466' in df.columns:
            df['466'] = df['466'].fillna(value='0.0')
        if '137' in df.columns:
            df['137'] = df['137'].fillna(value='117.7')
        if '366' in df.columns:
            df['366'] = df['366'].fillna(value='0.0043')
        if '119' in df.columns:
            df['119'] = df['119'].fillna(value='0.9694')
        if '322' in df.columns:
            df['322'] = df['322'].fillna(value='0.0')
        if '537' in df.columns:
            df['537'] = df['537'].fillna(value='0.0')
        if '519' in df.columns:
            df['519'] = df['519'].fillna(value='5.83295')
        if '410' in df.columns:
            df['410'] = df['410'].fillna(value='4.732749999999999')
        if '483' in df.columns:
            df['483'] = df['483'].fillna(value='148.3175')
        if '490' in df.columns:
            df['490'] = df['490'].fillna(value='48.55745')
        if '181' in df.columns:
            df['181'] = df['181'].fillna(value='0.524')
        if '476' in df.columns:
            df['476'] = df['476'].fillna(value='15.9738')
        if '501' in df.columns:
            df['501'] = df['501'].fillna(value='0.0')
        if '374' in df.columns:
            df['374'] = df['374'].fillna(value='0.0')
        if '414' in df.columns:
            df['414'] = df['414'].fillna(value='0.0')
        if '533' in df.columns:
            df['533'] = df['533'].fillna(value='0.0')
        if '514' in df.columns:
            df['514'] = df['514'].fillna(value='0.0')
        if '16' in df.columns:
            df['16'] = df['16'].fillna(value='9.85175')
        if '546' in df.columns:
            df['546'] = df['546'].fillna(value='0.9111')
        if '288' in df.columns:
            df['288'] = df['288'].fillna(value='0.0036')
        if '87' in df.columns:
            df['87'] = df['87'].fillna(value='0.9874')
        if '389' in df.columns:
            df['389'] = df['389'].fillna(value='0.0003')
        if '77' in df.columns:
            df['77'] = df['77'].fillna(value='-0.0099')
        if '467' in df.columns:
            df['467'] = df['467'].fillna(value='5.645')
        if '372' in df.columns:
            df['372'] = df['372'].fillna(value='0.0')
        if '383' in df.columns:
            df['383'] = df['383'].fillna(value='0.3726')
        if '403' in df.columns:
            df['403'] = df['403'].fillna(value='0.0')
        if '493' in df.columns:
            df['493'] = df['493'].fillna(value='2.5291')
        if '82' in df.columns:
            df['82'] = df['82'].fillna(value='0.0076')
        if '291' in df.columns:
            df['291'] = df['291'].fillna(value='0.0169')
        if '316' in df.columns:
            df['316'] = df['316'].fillna(value='5.8315')
        if '36' in df.columns:
            df['36'] = df['36'].fillna(value='49.6036')
        if '130' in df.columns:
            df['130'] = df['130'].fillna(value='0.75875')
        if '513' in df.columns:
            df['513'] = df['513'].fillna(value='0.0')
        if '204' in df.columns:
            df['204'] = df['204'].fillna(value='0.1582')
        if '379' in df.columns:
            df['379'] = df['379'].fillna(value='0.0')
        if '571' in df.columns:
            df['571'] = df['571'].fillna(value='2.1186')
        if '175' in df.columns:
            df['175'] = df['175'].fillna(value='0.7682')
        if '177' in df.columns:
            df['177'] = df['177'].fillna(value='0.299')
        if '555' in df.columns:
            df['555'] = df['555'].fillna(value='54.4417')
        if '451' in df.columns:
            df['451'] = df['451'].fillna(value='0.0')
        if '250' in df.columns:
            df['250'] = df['250'].fillna(value='103.0936')
        if '151' in df.columns:
            df['151'] = df['151'].fillna(value='10.993500000000001')
        if '216' in df.columns:
            df['216'] = df['216'].fillna(value='0.0846')
        if '116' in df.columns:
            df['116'] = df['116'].fillna(value='0.9905')
        if '247' in df.columns:
            df['247'] = df['247'].fillna(value='0.027')
        if '274' in df.columns:
            df['274'] = df['274'].fillna(value='110.6014')
        if '439' in df.columns:
            df['439'] = df['439'].fillna(value='65.4378')
        if '423' in df.columns:
            df['423'] = df['423'].fillna(value='69.90545')
        if '121' in df.columns:
            df['121'] = df['121'].fillna(value='15.79')
        if '146' in df.columns:
            df['146'] = df['146'].fillna(value='0.05')
        if '228' in df.columns:
            df['228'] = df['228'].fillna(value='0.0155')
        if '317' in df.columns:
            df['317'] = df['317'].fillna(value='0.1634')
        if '212' in df.columns:
            df['212'] = df['212'].fillna(value='0.0416')
        if '168' in df.columns:
            df['168'] = df['168'].fillna(value='0.119')
        if '344' in df.columns:
            df['344'] = df['344'].fillna(value='23.2147')
        if '45' in df.columns:
            df['45'] = df['45'].fillna(value='136.4')
        if '197' in df.columns:
            df['197'] = df['197'].fillna(value='19.37')
        if '504' in df.columns:
            df['504'] = df['504'].fillna(value='0.0')
        if '76' in df.columns:
            df['76'] = df['76'].fillna(value='-0.0289')
        if '210' in df.columns:
            df['210'] = df['210'].fillna(value='0.0797')
        if '481' in df.columns:
            df['481'] = df['481'].fillna(value='0.0')
        if '15' in df.columns:
            df['15'] = df['15'].fillna(value='412.2191')
        if '206' in df.columns:
            df['206'] = df['206'].fillna(value='0.0')
        if '543' in df.columns:
            df['543'] = df['543'].fillna(value='0.0078')
        if '464' in df.columns:
            df['464'] = df['464'].fillna(value='0.0')
        if '353' in df.columns:
            df['353'] = df['353'].fillna(value='0.0421')
        if '498' in df.columns:
            df['498'] = df['498'].fillna(value='0.0')
        if '242' in df.columns:
            df['242'] = df['242'].fillna(value='0.0')
        if '323' in df.columns:
            df['323'] = df['323'].fillna(value='5.4588')
        if '80' in df.columns:
            df['80'] = df['80'].fillna(value='-0.0087')
        if '550' in df.columns:
            df['550'] = df['550'].fillna(value='16.34')
        if '221' in df.columns:
            df['221'] = df['221'].fillna(value='0.0609')
        if '428' in df.columns:
            df['428'] = df['428'].fillna(value='2.5341')
        if '9' in df.columns:
            df['9'] = df['9'].fillna(value='-0.0013')
        return(df)