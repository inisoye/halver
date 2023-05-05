# flake8: noqa E501

import json

from libraries.paystack.bank_requests import BankRequests

banks = BankRequests.list(country="nigeria")

# Images obtained from: https://github.com/ichtrojan/nigerian-banks
bank_images = {
    "044": "https://nigerianbanks.xyz/logo/access-bank.png",
    "063": "https://nigerianbanks.xyz/logo/access-bank-diamond.png",
    "035A": "https://nigerianbanks.xyz/logo/alat-by-wema.png",
    "401": "https://nigerianbanks.xyz/logo/asosavings.png",
    "023": "https://nigerianbanks.xyz/logo/citibank-nigeria.png",
    "050": "https://nigerianbanks.xyz/logo/ecobank-nigeria.png",
    "098": "https://nigerianbanks.xyz/logo/ekondo-microfinance-bank.png",
    "562": "https://nigerianbanks.xyz/logo/ekondo-microfinance-bank.png",
    "070": "https://nigerianbanks.xyz/logo/fidelity-bank.png",
    "011": "https://nigerianbanks.xyz/logo/first-bank-of-nigeria.png",
    "214": "https://nigerianbanks.xyz/logo/first-city-monument-bank.png",
    "00103": "https://nigerianbanks.xyz/logo/globus-bank.png",
    "058": "https://nigerianbanks.xyz/logo/guaranty-trust-bank.png",
    "030": "https://nigerianbanks.xyz/logo/heritage-bank.png",
    "082": "https://nigerianbanks.xyz/logo/keystone-bank.png",
    "50211": "https://nigerianbanks.xyz/logo/kuda-bank.png",
    "327": "https://nigerianbanks.xyz/logo/paga.png",
    "076": "https://nigerianbanks.xyz/logo/polaris-bank.png",
    "51310": "https://nigerianbanks.xyz/logo/sparkle-microfinance-bank.png",
    "221": "https://nigerianbanks.xyz/logo/stanbic-ibtc-bank.png",
    "068": "https://nigerianbanks.xyz/logo/standard-chartered-bank.png",
    "232": "https://nigerianbanks.xyz/logo/sterling-bank.png",
    "302": "https://nigerianbanks.xyz/logo/taj-bank.png",
    "032": "https://nigerianbanks.xyz/logo/union-bank-of-nigeria.png",
    "033": "https://nigerianbanks.xyz/logo/united-bank-for-africa.png",
    "035": "https://nigerianbanks.xyz/logo/wema-bank.png",
    "057": "https://nigerianbanks.xyz/logo/zenith-bank.png",
}

# Images hosted on Cloudinary for project
bank_images_2 = {
    "120001": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262054/paystack/9mobile-Payment-Service-Bank-9PSB_f3p55s.jpg",
    "801": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262053/paystack/abbey_tkwycr.jpg",
    "51204": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262054/paystack/above-only_i1mobd.jpg",
    "51312": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262057/paystack/abulesoro_gq3zku.jpg",
    "602": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262053/paystack/accion_gui86v.jpg",
    "50036": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262057/paystack/AHMADU-BELLO-MFB_cphxf0.jpg",
    "120004": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262059/paystack/airtel-smartcash_ynuk4z.jpg",
    "51336": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262057/paystack/aku_a6utse.jpg",
    "50926": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262057/paystack/amju_liverf.jpg",
    "51341": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262058/paystack/ampersand_oukobo.jpg",
    "50083": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/aramoko_qobkpd.jpg",
    "401": "==https://res.cloudinary.com/duvwrrksq/image/upload/v1683265047/paystack/aso_cluhrz.jpg",
    "MFB50094": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262057/paystack/astrapolaris_watybn.jpg",
    "51229": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262055/paystack/bainescredit_vx6heu.jpg",
    "50931": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/bowen_wjodht.jpg",
    "FC40163": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262059/paystack/branch_guwiyb.jpg",
    "565": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683264481/paystack/carbon_wvoqpu.jpg",
    "865": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/cashconnect_c1xabe.jpg",
    "50823": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262052/paystack/CEMCS-Logo_c0tsas.jpg",
    "50171": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262053/paystack/chanelle_njsd8b.jpg",
    "50910": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262059/paystack/consumer_kjwpqo.jpg",
    "50204": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262056/paystack/corestep_qbqjis.jpg",
    "559": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262057/paystack/coronation_cta8ww.jpg",
    "FC40128": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/country_bn0nct.jpg",
    "50162": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262056/paystack/dot_nipgx6.jpg",
    "50263": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262054/paystack/ekimogun_o3kkod.jpg",
    "50126": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262053/paystack/Eyowo_Logo_flhf1l.jpg",
    "51318": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/fairmoney_mcjngq.jpg",
    "51314": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262058/paystack/firmus_r75gdu.jpg",
    "107": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262059/paystack/firsttrust_pgnbm6.jpg",
    "50315": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262061/paystack/flourish_w5odsu.jpg",
    "501": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262054/paystack/fsdh_lyr6vj.jpg",
    "812": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262059/paystack/gateway-mortage_ajfpft.jpg",
    "100022": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262056/paystack/gomoney_gspcgl.jpg",
    "562": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683264779/paystack/greenwich_s33kvj.jpg",
    "51251": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262057/paystack/hackman_rsnxws.jpg",
    "50383": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262061/paystack/hasal_ups3qt.jpg",
    "120002": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262052/paystack/hopepsb_vzvnhm.jpg",
    "51244": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262056/paystack/ibile_fegrnm.jpg",
    "50439": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262057/paystack/ikoyi-osun_gzupcu.jpg",
    "50442": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262054/paystack/ilaro_l2lj1y.jpg",
    "50457": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262059/paystack/inifinity_it9hgm.jpg",
    "301": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262054/paystack/jaiz_dwwqgu.jpg",
    "50502": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262057/paystack/kadpoly_hzjxeg.jpg",
    "50200": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262058/paystack/kredi_p5cfc0.jpg",
    "90052": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262058/paystack/lbic_ie0qzl.jpg",
    "50549": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/linksmfb_vcvoqe.jpg",
    "031": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262061/paystack/livingtrust_rkmhhi.jpg",
    "303": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/lotus_q4phyv.jpg",
    "50563": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/mayfair_lg7myq.jpg",
    "50304": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262059/paystack/mintmfb_gzrrhw.jpg",
    "50515": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262058/paystack/Moniepoint_Logo_skipdx.jpg",
    "120003": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262055/paystack/mtn-momo_bezeeo.jpg",
    "100002": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262057/paystack/Paga_Logo_hl1waz.jpg",
    "999991": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262052/paystack/palmpay_g8vbfx.jpg",
    "104": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/parallex_flql5w.jpg",
    "311": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/readycash_lnn4jz.jpg",
    "50743": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/peacemfb_grnvqr.jpg",
    "51146": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262055/paystack/personaltrust_uttize.jpg",
    "50746": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262055/paystack/petra_xh2fwb.jpg",
    "50864": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262053/paystack/polyunwana_detomy.jpg",
    "105": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262055/paystack/premium-trust_uadz9q.jpg",
    "101": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683264481/paystack/providus_sfs72w.jpg",
    "51293": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262054/paystack/quickfund_xek4s9.jpg",
    "502": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262052/paystack/rand-merchant_v2oh3p.jpg",
    "90067": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262056/paystack/refugemfb_ih9kdb.jpg",
    "50767": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262055/paystack/rockshield_jzos7o.jpg",
    "125": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262058/paystack/rubies_hwceq5.jpg",
    "51113": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262056/paystack/safehaven_kcnver.jpg",
    "951113": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262056/paystack/safehaven_kcnver.jpg",
    "51062": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262055/paystack/solid-allianze_aluvku.jpg",
    "50800": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262053/paystack/solidrock_ujgc2o.jpg",
    "51253": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262058/paystack/stellas_gctib3.jpg",
    "100": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262060/paystack/suntrust_b7cdqd.jpg",
    "50968": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262059/paystack/suprememfb_ggvjnr.jpg",
    "090560": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262056/paystack/tanadi_ewpue1.jpg",
    "51269": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262053/paystack/tangerine_giwfd1.jpg",
    "51211": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262056/paystack/tcf-MFB_bnl3tb.jpg",
    "102": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262059/paystack/titan_tgp0eq.jpg",
    "50840": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262058/paystack/u_cmfb_y97j8p.jpg",
    "MFB51322": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262052/paystack/uhuru_s5djzi.jpg",
    "50870": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262051/paystack/unaabmfb_cln7ly.jpg",
    "50871": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262061/paystack/unical_p7wekt.jpg",
    "51316": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262055/paystack/unilag_bdnl2g.jpg",
    "215": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683264481/paystack/unity_b5g06m.jpg",
    "566": "https://res.cloudinary.com/duvwrrksq/image/upload/v1683262056/paystack/vfd_vpd1la.jpg",
}

banks_with_images = []
codes = {}

for bank in banks["data"]:
    bank_code = bank["code"]
    bank_name = bank["name"]
    codes[bank_code] = bank_name

    if bank_code in bank_images:
        image_url = bank_images[bank_code]
        banks_with_images.append({**bank, "logo": image_url})
    elif bank_code in bank_images_2:
        image_url = bank_images_2[bank_code]
        banks_with_images.append({**bank, "logo": image_url})
    else:
        banks_with_images.append(bank)


print((banks_with_images))
