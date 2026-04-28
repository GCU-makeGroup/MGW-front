<aside>
📍

설정 전체 조회 API

- 설명 : 설정 화면 진입 시 매칭/소통, 알림, 언어, 보안, 시스템 설정값을 한 번에 조회합니다.
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path / Query / Body | - | N | - | 별도 요청값 없음 |
- Request Sample
    
    ```
    {}
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 설정 조회 성공 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 404 | 회원 설정 정보를 찾을 수 없음 |
| Error | 500 | 서버 내부 오류 |
- Response Sample (응답 값은 유도리 있게 변경)
    
    ```json
    {
      "isSuccess":true,
      "code":"SETTING2001",
      "message":"설정 조회에 성공했습니다.",
      "result": {
        "profile": {
          "name":"Alex Kim",
          "major":"Software Engineering",
          "grade":"Senior",
          "academicVerified":true,
          "profileImageUrl":"https://cdn.example.com/profile/2.png"
        },
        "matchingCommunication": {
          "interestKeywords": ["Back-end","Guitar","K-Pop"],
          "preferredLanguage":"KOREAN"
        },
        "notifications": {
          "newMessages":true,
          "groupInvites":true,
          "postComments":false,
          "etiquetteMode":true,
          "etiquetteStartTime":"23:00",
          "etiquetteEndTime":"07:00"
        },
        "languageRegion": {
          "appLanguage":"ENGLISH"
        },
        "accountSecurity": {
          "studentId":"2021034920",
          "department":"College of AI & Software",
          "twoFactorEnabled":false
        },
        "system": {
          "darkMode":false
        }
      }
    }
    ```
    
</aside>

<aside>
📍

관심 키워드 / 선호 언어 수정 API

- 설명 : 관심 키워드와 선호 언어를 수정합니다.
- 헤더
    - Authorization: Bearer {accessToken}
    - Content-Type: application/json

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | interestKeywords | N | Array<String> | 관심 키워드 목록 |
| Body | preferredLanguage | N | String | 선호 언어(KOREAN, ENGLISH, NONE) |
- Request Sample
    
    ```json
    {
      "interestKeywords": ["Back-end","Guitar","K-Pop","AI"],
      "preferredLanguage":"ENGLISH"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 관심 키워드/선호 언어 수정 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess":true,
      "code":"SETTING2002",
      "message":"관심 키워드 및 선호 언어가 수정되었습니다.",
      "result": {
        "interestKeywords": ["Back-end","Guitar","K-Pop","AI"],
        "preferredLanguage":"ENGLISH"
      }
    }
    ```
    
</aside>
<aside>
📍

알림 설정 수정 API

- 설명 : 메시지, 그룹 초대, 댓글, 에티켓 모드 등 알림 관련 설정을 수정합니다.
- 헤더
    - Authorization: Bearer {accessToken}
    - Content-Type: application/json

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | newMessages | N | Boolean | 새 메시지 알림 여부 |
| Body | groupInvites | N | Boolean | 그룹 초대 알림 여부 |
| Body | postComments | N | Boolean | 게시글 댓글 알림 여부 |
| Body | etiquetteMode | N | Boolean | 에티켓 모드 활성화 여부 |
| Body | etiquetteStartTime | N | String | 에티켓 시작 시간(HH:mm) |
| Body | etiquetteEndTime | N | String | 에티켓 종료 시간(HH:mm) |
- Request Sample
    
    ```json
    {
      "newMessages":true,
      "groupInvites":false,
      "postComments":true,
      "etiquetteMode":true,
      "etiquetteStartTime":"23:00",
      "etiquetteEndTime":"07:00"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 알림 설정 수정 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess":true,
      "code":"SETTING2003",
      "message":"알림 설정이 수정되었습니다.",
      "result": {
        "newMessages":true,
        "groupInvites":false,
        "postComments":true,
        "etiquetteMode":true,
        "etiquetteStartTime":"23:00",
        "etiquetteEndTime":"07:00"
      }
    }
    ```
    
</aside>

<aside>
📍

앱 언어 수정 API

- 설명 : 앱 전체에서 사용할 언어를 변경합니다.
- 헤더
    - Authorization: Bearer {accessToken}
    - Content-Type: application/json

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | appLanguage | Y | String | 앱 언어(KOREAN, ENGLISH) |
- Request Sample
    
    ```json
    {
      "appLanguage":"ENGLISH"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 앱 언어 변경 성공 |
| Error | 400 | 지원하지 않는 언어 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess":true,
      "code":"SETTING2004",
      "message":"앱 언어가 변경되었습니다.",
      "result": {
        "appLanguage":"ENGLISH"
      }
    }
    ```
    
</aside>

<aside>
📍 000 **이메일 재인증 API**

- 설명 : 가천대학교 이메일을 재인증합니다.
- 헤더
    - 

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
- Request Sample
    
    ```json
    
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
|  |  |  |
|  |  |  |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    
    ```
    
</aside>


<aside>
📍

다크모드 설정 API

- 설명 : 앱 다크모드 사용 여부를 변경합니다.
- 헤더
    - Authorization: Bearer {accessToken}
    - Content-Type: application/json

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | darkMode | Y | Boolean | 다크모드 활성화 여부 |
- Request Sample
    
    ```json
    {
      "darkMode":true
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 다크모드 설정 변경 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess":true,
      "code":"SETTING2005",
      "message":"다크모드 설정이 변경되었습니다.",
      "result": {
        "darkMode":true
      }
    }
    ```
    
</aside>

<aside>
📍 000 **회원 탈퇴 API**

- 설명 : 탈퇴 어떻게 할건지 정확하게 결정되지 않음.
- 헤더 : 

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
- Request Sample
    
    ```json
    
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
|  |  |  |
|  |  |  |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    
    ```
    
</aside>