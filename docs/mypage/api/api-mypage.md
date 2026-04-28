<aside>
📍 000 **일정 조회(캘린더) API**

- 설명 :
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

** 마이페이지 메인 조회 API ** 

- 설명 : 마이페이지 화면 진입 시 사용자 프로필, 인증 여부, 활동 통계(posts, groups, points)를 조회합니다.
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
| Success | 200 | 응답 성공 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 404 | 회원 정보를 찾을 수 없음 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess":true,
      "code":"COMMON200",
      "message":"성공입니다.",
      "result": {
        "memberId":1,
        "name":"Kim Min-jun",
        "profileImageUrl":"https://cdn.example.com/profile/1.png",
        "emailVerified":true,
        "verifiedBadgeLabel":"Gachon Email Verified",
        "stats": {
          "postCount":24,
          "groupCount":8,
          "point":1250
        }
      }
    }
    ```
    

---

</aside>


<aside>
📍

프로필 수정 API

- 설명 : 프로필 이미지, 이름 등 마이페이지 프로필 정보를 수정합니다.
- 헤더
    - Authorization: Bearer {accessToken}
    - Content-Type: application/json

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | name | N | String | 사용자 이름 |
| Body | profileImageUrl | N | String | 프로필 이미지 URL |
- Request Sample
    
    ```json
    {
      "name":"Kim Min-jun",
      "profileImageUrl":"https://cdn.example.com/profile/new-image.png"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 프로필 수정 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 404 | 회원 정보를 찾을 수 없음 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess":true,
      "code":"MEMBER2001",
      "message":"프로필 수정이 완료되었습니다.",
      "result": {
        "memberId":1,
        "name":"Kim Min-jun",
        "profileImageUrl":"https://cdn.example.com/profile/new-image.png"
      }
    }
    ```
    
</aside>

이거는 보편적으로 작성했는데, 어떻게 할건지 논의 필요.

<aside>
📍

로그아웃 API

- 설명 : 현재 로그인 세션을 종료하고, 서버에서 refresh token 등을 무효화합니다.
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | refreshToken | N | String | 사용하는 인증 구조에 따라 필요할 수 있음 |
- Request Sample
    
    ```json
    {
      "refreshToken":"sample-refresh-token"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 로그아웃 성공 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess":true,
      "code":"AUTH2003",
      "message":"로그아웃되었습니다.",
      "result": {}
    }
    ```
    
</aside>

