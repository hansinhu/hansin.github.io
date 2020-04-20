#!/bin/bash

echo "Start Downloading Iconfont====="

curl -v --cookie "cna=6i2JFUXWcAwCAdy/utKh+Yz9;EGG_SESS_ICONFONT=U8AXvqwdm-42-umGXGwgKq_Emj2wuVCkA87TjZ3dn6xm2T4whio3sIKoy4kjkuBSusLMQ-0MhcjWBE1FwhfGmMbpO9xPCEANAHIhoET_7kJ_pbscGV6FmfCh8QTWcmCiTv5lhhXEW-AxLfe1otCy-eI-zPgODc0D5EZxlVSk4mqOdEz-94IZi5OAcsu3pRkTAQs9KRTgwyfMtp67P9YXwDeVNoXPHTR1XHpaQgBHgWZxIoXczyxCXVtKz5kL3XUgvwp6JLe2wev9xkYzghiHalEcVgXBk2n5LFdprz8IsWvSvPtDFiHEGsJqVyw04k-I9gEQgW0iKjKc2Inw625TY0FlleOhg6GWuzIIEK7JM-vl3pyA6ty1cBVbfPbjlqGjjnCDfUPk0PcB6XY_lQLLGl2ftO-1jpNLlWcmDi2RBPmQPtmAx2jVcifr_NmEDgKkmKuI1om3joeKz7LJ_5y_F0bEr-eorFmU8x_UbvAoo-Gn4PhtTjDKWYaBPj0EkuYOyUezcqd3k9GtoyihlfJSJeaPCjynuo1uGLZZ5qncasre1kk_gmdoK6X-FgdyG5y1xYUhH38fYa4HcgMs_SDFayl-nIFcdBwAtMsL3vx-3YMc58BvsWXmrimqX0WML7S8eZcfoJxzsgVQFhXXktVqUwMSu0BpAh5h7WdQ8NN4yTl52cXrpRHD2n03zCRrd4f00SJagZ8EAhRU6rydz0n2O8ruIcgRxNbtTM8RgY6W-ZiMjSjTVKDHXdnuKqOkmCmNAs64WjKppZa8rrXYCmj9NIO3C1T3zjvKOLiIvrsb4sjtZsofeiSVkk8sayPQReCv-7gfn60bAUrGHSUH_zupSts2pRaICNjXklqK6QoCQTI8PzAal9uqGWXxGsHM1I9v4ScUeDLgzbdS-P1AgK9kGKJ143Rn_XQvr740nMKNLuYzuPyYnQd_bz20X5Sq7Hi2fbLNXAPbZb9lgvBxmr1kJcBT99mw276BoT33O3xQvQA=;trace=AQAAALh0+Udq1wAAnNvpc47Tnog+BUW2;ctoken=uTpWOd5K_sedYIt5OsBI9tNK;u=233031;u.sig=G6_P_WlJtTmJMLK4DjWZ9gmotBMLdpm3eJ5Vw6HAZ8Q;isg=BDg4Vg0ZkcdFwv0X8UKdSWAwCeAKCR0b6u8O4XKpNXMbjdl3GrPSu6vrRcWY3VQD" https://www.iconfont.cn/api/project/download.zip\?spm\=a313x.7781069.1998910419.d7543c303\&pid\=111282\&ctoken\=uTpWOd5K_sedYIt5OsBI9tNK --output download.zip

echo "Start Unzip Iconfont===="

unzip download.zip

echo "Start Clean OLD Iconfont====="

cd ../source/styles/iconfont
rm -rf icon*

cd ../../../script

echo "Start Copy New Iconfont====="
cp font*/icon* ../source/styles/iconfont

echo "Start Clean download And Zip"

rm -rf download.zip
rm -rf font_*

echo "Done"
