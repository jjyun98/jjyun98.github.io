---
title: '데이터 시각화 - folium으로 지도 그리기'
published: 2021-11-24
draft: false
description: 'folium으로 지도를 띄우고 마커, 히트맵, 시간에 따라 움직이는 히트맵을 올린다. GeoJSON 경계와 데이터프레임을 key로 연결하는 코로플레스 맵으로 시도별, 전라북도 시군별 인구를 그리고, key가 유일해야 한다는 점을 실제 자료의 함정으로 확인한다.'
series: '데이터 시각화'
seriesOrder: 12
tags: ['데이터 시각화', 'folium', '지도', '코로플레스', 'Python']
---

위도와 경도가 있는 자료는 지도 위에 그려야 잘 읽힌다. folium은 웹 지도 라이브러리인 Leaflet을 파이썬에서 쓰게 해 주는 패키지다. 결과는 HTML이라 확대, 이동, 클릭이 된다.

```python
import json
import requests
import numpy as np
import pandas as pd
import folium
from folium import plugins
import plotly.express as px
```

## 1. 지도와 마커

`folium.Map`이 바탕 지도다. 중심 좌표 `location=[위도, 경도]`와 확대 정도 `zoom_start`를 준다. `tiles`로 지도 외형을 바꾼다.

```python
m = folium.Map(location=[35.8468, 127.1294], zoom_start=15, scrollWheelZoom=False)
m
```

<iframe src="/charts/dv/dv12-map.html" width="100%" height="400px" frameborder="0" scrolling="no"></iframe>

| tiles | 모양 |
|---|---|
| `'OpenStreetMap'` (기본) | 일반 지도 |
| `'CartoDB positron'` | 연한 회색, 위에 올린 자료가 잘 보임 |
| `'CartoDB dark_matter'` | 어두운 바탕 |

강의 당시 쓰던 Stamen 타일(Terrain, Toner, Watercolor)은 2023년부터 Stadia Maps로 옮겨져 API 키가 있어야 한다.

지도에 무언가를 올릴 때는 객체를 만들고 `.add_to(m)`으로 붙인다. 가장 기본은 마커다. `popup`(클릭)과 `tooltip`(마우스 올림)에는 HTML이 들어가므로 `df.to_html()`로 표를 넣을 수도 있다. `CircleMarker`는 화면 픽셀 기준 반지름의 원을 그린다.

```python
tb = pd.DataFrame({'Year': [2019, 2020, 2021], 'Enrollment': [35, 35, 33]})

m = folium.Map(location=[35.8468, 127.1294], zoom_start=14)
folium.Marker([35.8468, 127.1294], popup='<b>JBNU</b>' + tb.to_html(index=False), tooltip='JBNU',
              icon=folium.Icon(color='red', icon='university', prefix='fa')).add_to(m)
folium.Marker([35.8377, 127.1121], popup='HOME', tooltip='HOME').add_to(m)
folium.CircleMarker([35.8468, 127.1294], radius=40, color=None,
                    fill=True, fill_color='red', fill_opacity=0.3).add_to(m)
```

<iframe src="/charts/dv/dv12-marker.html" width="100%" height="400px" frameborder="0" scrolling="no"></iframe>

빨간 마커를 클릭하면 표가 뜬다. `icon`에는 Font Awesome 아이콘 이름(`'tree'`, `'plane'`, `'bell'` 등)을 쓴다.

## 2. 히트맵

점이 많으면 마커 대신 밀도로 보여 준다. `plugins.HeatMap`은 `[위도, 경도, 가중치]`의 리스트를 받아, 점이 몰린 곳을 뜨겁게 칠한다. 지도 위의 2차원 KDE([5편](/posts/dv-05-kde-qqplot))라고 생각하면 된다.

```python
data = (np.random.normal(size=(100, 3)) + np.array([[28, 77, 5]])).tolist()
m = folium.Map([28, 77], zoom_start=6)
plugins.HeatMap(data).add_to(m)
```

<iframe src="/charts/dv/dv12-heat.html" width="100%" height="400px" frameborder="0" scrolling="no"></iframe>

### 시간에 따라 움직이는 히트맵

`plugins.HeatMapWithTime`은 **프레임별 점 리스트**를 받아 재생 버튼이 있는 애니메이션을 만든다. 입력의 모양은 (프레임 수) × (점의 수) × 2이다.

한 지점에서 출발한 입자 200개가 무작위로 움직인다고 하자.

$$
x_t = x_{t-1} + \epsilon_t, \qquad y_t = y_{t-1} + \eta_t, \qquad \epsilon_t, \eta_t \overset{iid}{\sim} N(0, \sigma^2)
$$

시점 $t$의 위치는 출발점에 $t$번의 이동을 **누적해서 더한** 것이다. `walk[:i].sum(axis=0)`이 그 누적합이다.

```python
t0 = np.array([[35.8377, 127.1121]] * 200)            # 200개 입자의 출발점
walk = np.random.normal(size=(80, 200, 2)) * 0.0002   # 80번의 이동
data = [(t0 + walk[:i].sum(axis=0)).tolist() for i in range(80)]
np.array(data).shape   # (80, 200, 2)

m = folium.Map(location=[35.8377, 127.1121], zoom_start=16)
plugins.HeatMapWithTime(data, radius=5, auto_play=True).add_to(m)
```

<iframe src="/charts/dv/dv12-walk.html" width="100%" height="420px" frameborder="0" scrolling="no"></iframe>

한 점에 모여 있던 입자가 퍼져 나간다. 기체의 확산과 같은 모양이다. 퍼진 정도는 $\sqrt{t}$에 비례한다([확률과정론](/series/확률과정론)의 랜덤워크).

### 예제: 1965–2016년 지진

plotly 저장소의 지진 자료는 규모 5.5 이상의 지진 23,412건의 날짜, 위도, 경도, 규모다. 연도별로 나눠 프레임을 만든다.

```python
eq = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/earthquakes-23k.csv')
eq['Year'] = pd.to_datetime(eq.Date, format='mixed', utc=True).dt.year
lst = [g[['Latitude', 'Longitude', 'Magnitude']].to_numpy().tolist() for _, g in eq.groupby('Year')]

m = folium.Map(location=[20, 150], zoom_start=2)
plugins.HeatMapWithTime(lst, radius=5, index=sorted(eq.Year.unique().tolist())).add_to(m)
```

<iframe src="/charts/dv/dv12-quake.html" width="100%" height="440px" frameborder="0" scrolling="no"></iframe>

날짜는 대부분 `01/02/1965` 꼴이지만 3건은 `1975-02-23T02:58:41.000Z` 꼴이다. `Date.str.split('/')`의 마지막 조각을 연도로 쓰면 이 3건이 별도의 "연도"가 되어 그룹이 52개가 아닌 55개가 되고, 프레임과 연도 라벨이 어긋난다. `to_datetime(format='mixed')`로 날짜로 바꾼 뒤 연도를 뽑아야 안전하다.

재생해 보면 지진이 태평양 둘레(불의 고리)에 매년 반복해서 나타난다. 2011년이 713건으로 가장 많은데, 그중 263건(37%)이 동일본 대지진이 일어난 일본 동쪽 해역(북위 34–42도, 동경 138–146도)에 몰려 있다.

## 3. 코로플레스 맵

코로플레스(choropleth) 맵은 행정구역 같은 **영역**을 값에 따라 칠한 지도다. 두 가지 자료를 연결해야 한다.

1. 영역의 경계: GeoJSON 파일(다각형 좌표 + 속성)
2. 영역별 값: 데이터프레임

### GeoJSON 뜯어보기

[southkorea-maps](https://github.com/southkorea/southkorea-maps)에서 2018년 시도와 시군구 경계를 받는다. JSON은 파이썬의 딕셔너리, 리스트와 같은 구조라 `json.load`로 읽으면 바로 다룰 수 있다.

```python
base = 'https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/'
prov = json.loads(requests.get(base + 'skorea-provinces-2018-geo.json').text)
muni = json.loads(requests.get(base + 'skorea-municipalities-2018-geo.json').text)

muni.keys()                          # dict_keys(['type', 'features', 'name', 'crs'])
len(muni['features'])                # 250
muni['features'][0]['properties']
```

```
{'name': '종로구', 'base_year': '2018', 'name_eng': 'Jongno-gu', 'code': '11010'}
```

`features`가 영역 250개의 리스트이고, 각 영역은 `geometry`(경계 좌표)와 `properties`(이름, 영문 이름, 코드)를 가진다. 원본은 시도 7.5MB, 시군구 18MB로 크다. 웹에 올릴 그림은 경계를 단순화(`shapely`의 `simplify`)해서 썼다.

전주시의 두 구만 골라 새 GeoJSON을 만든다. 딕셔너리를 `=`로 넘기면 같은 객체를 가리키므로, `dict(...)`로 복사한 뒤 `features`만 바꾼다.

```python
jj = dict(muni)
jj['features'] = [f for f in muni['features'] if f['properties']['name'] in ['전주시완산구', '전주시덕진구']]
```

### key로 연결하기

```python
df = pd.DataFrame({'key': ['전주시덕진구', '전주시완산구'], 'value': [20, 30]})

m = folium.Map([35.83, 127.12], zoom_start=11)
folium.Choropleth(
    geo_data=jj,                         # 자료 2: 경계
    data=df,                             # 자료 1: 값
    columns=['key', 'value'],            # 자료 1의 [연결 열, 색으로 칠할 열]
    key_on='feature.properties.name',    # 자료 2의 연결 경로
    fill_color='YlGn',
).add_to(m)
```

<iframe src="/charts/dv/dv12-jeonju.html" width="100%" height="400px" frameborder="0" scrolling="no"></iframe>

[9편](/posts/dv-09-pandas-reshape)의 `merge`와 같은 구조다. 데이터프레임 쪽의 연결 열은 `columns`의 첫 원소이고, GeoJSON 쪽은 `key_on`이 가리키는 경로다. `key_on`은 항상 `feature`로 시작하고 그다음은 `features[i]` 아래의 경로를 적는다. 그래서 `'feature.properties.name_eng'`이나 `'feature.properties.code'`로 바꾸면 영문 이름이나 행정코드로도 연결된다.

### 시도별 인구

강의에서 제공한 시도별 총인구수 표는 시도 이름이 GeoJSON과 정확히 같다.

```python
pp = pd.read_csv('https://raw.githubusercontent.com/guebin/2021DV/master/_notebooks/2021-11-22-prov.csv')
pp.columns = ['name', 'pop']

m = folium.Map([36, 127.8], zoom_start=6)
folium.Choropleth(geo_data=prov, data=pp, columns=['name', 'pop'],
                  key_on='feature.properties.name', fill_color='YlOrRd').add_to(m)
```

<iframe src="/charts/dv/dv12-prov.html" width="100%" height="460px" frameborder="0" scrolling="no"></iframe>

경기도 1,355만 명, 서울 953만 명, 부산 336만 명 순이다. 값의 차이가 커서 수도권만 진하고 나머지는 거의 같은 색이다. 인구처럼 치우친 값은 로그를 취하거나 인구밀도처럼 면적으로 나눈 값을 칠하는 편이 낫다. 큰 영역이 눈에 많이 띄는 것도 코로플레스의 약점이다([6편](/posts/dv-06-good-visualization)의 거짓말 지수).

### 함정: key는 유일해야 한다

시군구 인구 표는 그대로 연결되지 않는다.

```python
mp = pd.read_csv('https://raw.githubusercontent.com/guebin/2021DV/master/_notebooks/2021-11-22-muni.csv')
mp.columns = ['name', 'pop']
names = [f['properties']['name'] for f in muni['features']]

len(mp), mp.name.nunique(), mp.name.isin(names).sum()   # (274, 250, 219)
mp.name.value_counts().loc[lambda s: s > 1]
```

```
중구 6, 동구 6, 서구 5, 남구 5, 북구 5, 강서구 2, 고성군 2
```

문제가 세 가지다.

| 문제 | 예 |
|---|---|
| 같은 이름이 여러 곳 | 중구는 서울, 부산, 대구, 인천, 대전, 울산에 있다 |
| 표기가 다름 | 표는 `완산구`, GeoJSON은 `전주시완산구` |
| 영역이 아닌 행 | `전주시`(구의 합계), `전주시효자출장소`(인구 0) |

이름으로 연결하면 서울 중구와 부산 중구가 같은 값으로 칠해진다. 에러도 경고도 없이 그림이 나오므로 더 위험하다. 연결 열은 **유일한 key**(행정코드 같은)여야 한다.

여기서는 이름이 겹치지 않는 전라북도만 골라서 그린다. 전북의 열다섯 영역은 전국에서 이름이 하나뿐이고, 표기만 맞추면 된다.

```python
jb = dict(muni)
jb['features'] = [f for f in muni['features'] if f['properties']['code'].startswith('35')]   # 전북 코드 35
jbn = [f['properties']['name'] for f in jb['features']]

jbpop = (mp.replace({'name': {'완산구': '전주시완산구', '덕진구': '전주시덕진구'}})
           .query('name in @jbn'))
len(jbpop)   # 15

m = folium.Map([35.72, 127.15], zoom_start=9)
folium.Choropleth(geo_data=jb, data=jbpop, columns=['name', 'pop'],
                  key_on='feature.properties.name', fill_color='YlOrRd').add_to(m)
```

<iframe src="/charts/dv/dv12-jeonbuk.html" width="100%" height="460px" frameborder="0" scrolling="no"></iframe>

전주시 두 구(완산 33.7만, 덕진 32.1만)와 익산(27.9만), 군산(26.6만)이 진하고 동부 산간인 진안, 무주, 장수는 2만 명대다.

## 4. plotly로 그리기

plotly express의 `choropleth_map`도 같은 구조다. 인자 이름만 다르다.

| folium | plotly |
|---|---|
| `geo_data` | `geojson` |
| `columns=[key, value]` | `locations=key`, `color=value` |
| `key_on='feature.properties.name'` | `featureidkey='properties.name'` |

```python
fig = px.choropleth_map(pp, geojson=prov, locations='name', featureidkey='properties.name',
                        color='pop', center={'lat': 36, 'lon': 127.8}, zoom=5.3,
                        map_style='open-street-map', color_continuous_scale='YlOrRd')
fig.update_layout(margin=dict(r=0, t=0, l=0, b=0))
```

<iframe src="/charts/dv/dv12-plotly.html" width="100%" height="460px" frameborder="0" scrolling="no"></iframe>

마우스를 올리면 시도 이름과 인구가 바로 뜬다. 강의 당시의 `choropleth_mapbox`는 plotly 6부터 MapLibre 기반의 `choropleth_map`으로 바뀌었다.

## 정리

- `folium.Map` 위에 `Marker`, `CircleMarker`, `HeatMap`, `HeatMapWithTime`을 `.add_to(m)`으로 올린다.
- 코로플레스 맵은 GeoJSON과 데이터프레임을 key로 `merge`하는 것이다. 연결 경로는 `key_on='feature.properties...'`.
- key는 유일해야 한다. 이름으로 연결하면 같은 이름의 다른 지역이 같은 색이 된다.

## 시리즈를 마치며

열두 편에서 다룬 질문과 답을 모은다.

| 질문 | 답 | 편 |
|---|---|---|
| 두 그룹의 분포를 어떻게 비교하나? | 박스플랏, 히스토그램 | [1](/posts/dv-01-boxplot-histogram) |
| 이미지도 분포로 볼 수 있나? | 픽셀값 히스토그램, 평활화는 CDF로 펴기 | [2](/posts/dv-02-image-histogram-equalization) |
| 그림을 내 마음대로 고치려면? | Figure와 Axes를 직접 다룬다 | [3](/posts/dv-03-matplotlib-figure-axes) |
| 두 변수의 관계는? | 산점도. 상관계수는 직선 관계만 잰다 | [4](/posts/dv-04-scatter-correlation) |
| 분포 모양을 매끄럽게, 정규성은? | KDE, QQ플랏 | [5](/posts/dv-05-kde-qqplot) |
| 좋은 시각화란? | 데이터 잉크, 거짓말 지수, 여러 변수를 한 장에 | [6](/posts/dv-06-good-visualization) |
| 변수가 많으면? | 그래프 문법: 데이터, 맵핑, 기하, 면 | [7](/posts/dv-07-grammar-of-graphics) |
| 원하는 행과 열을 뽑으려면? | `loc`, `iloc`, `query` | [8](/posts/dv-08-pandas-selection) |
| 표를 그리기 좋은 모양으로? | `groupby`, `cut`, `melt`, `merge` → tidy data | [9](/posts/dv-09-pandas-reshape) |
| 상관이 있으면 인과인가? | 아니다. 교란변수로 층을 나눠 본다 | [10](/posts/dv-10-correlation-causation) |
| 표에서 바로, 인터랙티브하게? | `df.plot`, `backend='plotly'` | [11](/posts/dv-11-pandas-plot-plotly) |
| 위치가 있는 자료는? | folium 히트맵, 코로플레스 맵 | 12 |

공통된 흐름은 하나다. **표를 tidy하게 만들고, 변수를 시각 요소(위치, 색, 크기, 면)에 맵핑한다.** 도구는 matplotlib, plotnine, plotly, folium으로 바뀌어도 이 순서는 같다.

## 참고자료

- 최규빈, 「데이터시각화」 강의노트 11, 12주차 (전북대학교, 2021)
- [folium documentation](https://python-visualization.github.io/folium/)
- [southkorea-maps](https://github.com/southkorea/southkorea-maps)
- [plotly: Choropleth maps](https://plotly.com/python/tile-county-choropleth/)
