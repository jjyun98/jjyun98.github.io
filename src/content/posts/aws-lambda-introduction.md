---
title: 'AWS Lambda 시작하기: 서버리스 아키텍처의 핵심'
published: 2026-01-16
draft: false
description: 'AWS Lambda의 기본 개념과 주요 장점, 그리고 간단한 사용 예제에 대해 알아봅니다.'
series: 'AWS 기초'
tags: ['AWS', 'Lambda', 'Serverless']
---

# AWS Lambda란 무엇인가요?

AWS Lambda는 서버를 프로비저닝하거나 관리하지 않고도 코드를 실행할 수 있게 해주는 이벤트 중심의 서버리스 컴퓨팅 서비스입니다. Lambda를 사용하면 거의 모든 유형의 애플리케이션 또는 백엔드 서비스에 대한 코드를 별도의 관리 부담 없이 실행할 수 있습니다.

## 주요 특징

1.  **서버 관리 불필요**: 코드를 업로드하기만 하면 Lambda가 고가용성으로 코드를 실행 및 확장하는 데 필요한 모든 것을 처리합니다.
2.  **지속적 확장**: 애플리케이션에 대한 응답으로 각 트리거를 개별적으로 처리하여 코드를 자동으로 확장합니다.
3.  **밀리초 단위의 과금**: 코드가 실행되는 시간과 코드가 트리거되는 횟수에 대해서만 비용을 지불하면 됩니다.
4.  **다양한 언어 지원**: Node.js, Python, Java, Go, Ruby 등 다양한 런타임을 지원합니다.

## 간단한 Python Lambda 함수 예제

다음은 간단한 이벤트를 받아서 처리하는 Python 함수 예시입니다.

```python
import json

def lambda_handler(event, context):
    # 이벤트 데이터 확인
    name = event.get('name', 'World')
    message = f"Hello, {name}!"
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': message
        })
    }
```

## 사용 사례

*   **실시간 파일 처리**: S3에 이미지가 업로드될 때 자동으로 썸네일을 생성합니다.
*   **실시간 데이터 스트림 처리**: Kinesis에서 데이터를 읽어 실시간으로 분석합니다.
*   **백엔드 API**: API Gateway와 결합하여 완전한 서버리스 백엔드를 구축합니다.

## 결론

AWS Lambda는 현대적인 클라우드 네이티브 애플리케이션을 구축하는 데 있어 필수적인 도구입니다. 인프라 관리보다는 비즈니스 로직에 집중하고 싶다면 Lambda가 최고의 선택이 될 수 있습니다. :rocket:

## 블로그 기능 테스트

이 섹션에서는 블로그의 다양한 기능을 테스트합니다.

### 수식 (Math)

Lambda 함수의 비용 계산은 다음과 같은 수식으로 표현할 수 있습니다.

$$
\text{Total Cost} = (\text{Requests} \times \text{Price per Request}) + (\text{Duration} \times \text{Memory} \times \text{Price per GB-second})
$$

간단한 인라인 수식 예제: $E = mc^2$

### 팁과 주의사항 (Admonitions)

:::tip
Lambda 함수는 **Stateless**여야 합니다. 로컬 파일 시스템에 저장된 데이터는 유지되지 않을 수 있습니다.
:::

:::warning
Lambda 함수에는 실행 시간 제한(Timeout)이 있습니다. 기본값은 3초이며, 최대 15분까지 설정할 수 있습니다.
:::

:::note
이것은 일반적인 노트입니다.
:::

### 캐릭터 대화 (Character Dialogue)

:::owl
서버리스 아키텍처는 정말 편리하군요!
:::

:::duck
맞아요, 하지만 콜드 스타트(Cold Start) 문제를 고려해야 해요.
:::

:::unicorn
Provisioned Concurrency를 사용하면 콜드 스타트 문제를 완화할 수 있답니다!
:::

### GitHub 카드

::github{repo="jjyun98/jjyun98.github.io"}

