<aside>
📍 **로그인 API**

- 설명 : 가천대학교 이메일과 비밀번호를 이용해 사용자 인증을 수행하고, 성공 시 JWT(AccessToken 및 RefreshToken)를 발급합니다.
- 헤더
    - Content-Type: application/json

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| body | email | O | Stirng | 이메일 |
| body | password | O | String | 비밀번호 |
- Request Sample
    
    ```json
    {
      "email": "student@gachon.ac.kr",
      "password": "mySecretPassword123!"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 잘못된 요청 |
| Error | 401 | 인증 실패 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "status": 200,
      "message": "로그인에 성공했습니다.",
      "data": {
        "grantType": "Bearer",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
        "accessTokenExpiresIn": 1800000 
      }
    }
    ```
    
</aside>

<aside>
📍 **회원가입 API**

- 설명 : 이메일 인증이 완료된 사용자의 정보를 받아 DB에 새 회원을 생성합니다.
- 헤더
    - 

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | email | Y | String | 가천대 이메일 (`@gachon.ac.kr`) |
| Body | password | Y | String | 비밀번호 |
| Body | name | Y | String | 사용자 이름 |
| Body | major | Y | String | 학과명 |
| Body | studentId | Y | Int | 학번 |
| Body | emailToken | N | String | JWT로 이메일 인증을 구현할 경우 프론트에서 넘겨주는 인증 확인 토큰 |
- Request Sample
    
    ```json
    {
      "email": "student@gachon.ac.kr",
      "password": "mySecretPassword123!",
      "name": "홍길동"
    }
    
    // erd 짜면서 추가하기
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Success | 201 | 회원가입 성공 |
| Error | 400 | 잘못된 요청 (유효성 검사 실패 또는 이메일 인증을 안 한 상태) |
| Error | 409 | 이미 가입된 이메일 (중복 가입 시도) |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "status": 201,
      "message": "회원가입이 완료되었습니다.",
      "data": null
    }
    ```
    
</aside>

|  |  |  |  |  |
| --- | --- | --- | --- | --- |

<aside>
📍 이메일 인증 코드 발송 **API**

- 설명 : 입력한 이메일이 가천대 이메일(`@gachon.ac.kr`)인지 확인한 후, 6자리 인증 코드를 메일로 발송합니다.
- 헤더
    - 

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | email | Y | String | 인증을 요청할 가천대 이메일 |
- Request Sample
    
    ```json
    {
      "email": "student@gachon.ac.kr"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 가천대학교 이메일 형식이 아님 |
| Error | 409 | 이미 가입된 사용자 이메일 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "status": 200,
      "message": "이메일로 인증 코드가 발송되었습니다. (유효시간 5분)",
      "data": null
    }
    ```
    
</aside>

<aside>
📍 **이메일 인증 코드 재전송 API**

- 설명 : 인증 코드가 만료되었거나 메일을 받지 못한 경우, 코드를 재발송합니다. (기본 로직은 발송 API와 동일합니다)
- 헤더
    - 

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | email | Y | String | 인증을 요청할 가천대 이메일 |
- Request Sample
    
    ```json
    {
      "email": "student@gachon.ac.kr"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 가천대학교 이메일 형식이 아님 |
| Error | 409 | 이미 가입된 사용자 이메일 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "status": 200,
      "message": "이메일로 인증 코드가 발송되었습니다. (유효시간 5분)",
      "data": null
    }
    ```
    
</aside>

<aside>
📍 **이메일 인증 확인 API**

- 설명 : 사용자가 입력한 6자리 인증 코드가 서버(Redis 등)에 저장된 코드와 일치하는지 확인합니다.
- 헤더
    - 

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | email | Y | String | 인증 코드를 받을 이메일 |
| Body | code | Y | String | 사용자가 입력한 6자리 인증 코드 |
- Request Sample
    
    ```json
    {
      "email": "student@gachon.ac.kr",
      "code": "123456"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 코드가 일치하지 않거나 만료됨 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "status": 200,
      "message": "이메일 인증이 완료되었습니다.",
      "data": {
        "emailToken": "eyJhbGci... (만약 JWT 인증 방식을 쓴다면 여기에 발급)"
      }
    }
    ```
    
</aside>

<aside>
📍 **AccessToken 재발급 API**

- 설명 : AccessToken이 만료되었을 때, RefreshToken을 검증하여 새로운 AccessToken을 발급해 줍니다.
- 헤더
    - 

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | refreshToken | Y | String | 기존에 발급받은 RefreshToken |
- Request Sample
    
    ```json
    {
      "refreshToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 401 | RefreshToken이 만료되었거나 유효하지 않음 (다시 로그인 필요) |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "status": 200,
      "message": "AccessToken이 재발급되었습니다.",
      "data": {
        "accessToken": "새로_발급된_AccessToken_문자열...",
        "accessTokenExpiresIn": 1800000 
      }
    }
    ```
    
</aside>