<aside>
📍 액티비티 페이지 조회 **API**

- 설명 : 액티비티 처음 화면 조회
- 헤더
    - Authorization: Bearer {AccessToken}

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
📍 000 **활동 상세 페이지 조회 API**

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
📍 액티비티 생성 **API**

- 설명 : 새로운 액티비티를 생성합니다. (생성자는 자동으로 `created` 및 `joined` 상태가 됩니다.)
- 헤더
    - Content-Type: application/json
    - Authorization: Bearer {AccessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Body | title | Y | String | 액티비티 메인 제목 |
| Body | subtitle | N | String | 액티비티 서브 타이틀 |
| Body | description | Y | String | 액티비티 상세 설명 |
| Body | maxMembers | Y | Integer | 최대 참여 가능 인원 |
- Request Sample
    
    ```json
    {
      "title": "AI Research Lab",
      "subtitle": "Project: Neural Networks",
      "description": "딥러닝 스터디원 모집합니다.",
      "maxMembers": 10
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 201 | 응답 성공 (생성 완료) |
| Error | 400 | 필수 입력값 누락 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "status": 201,
      "message": "액티비티 생성 성공",
      "data": {
        "activityId": 3  // 방금 생성된 액티비티의 ID 반환
      }
    }
    ```
    
</aside>

<aside>
📍 액티비티 참여 **API**

- 설명 : 특정 액티비티에 멤버로 참여(Joined)합니다.
- 헤더
    - Authorization: Bearer {AccessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path | activityId | Y | Long | 참여할 액티비티의 고유 ID |
- Request Sample
    
    ```json
    
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 (참여 완료) |
| Error | 404 | 존재하지 않는 액티비티 ID |
| Error | 409 | 이미 참여 중인 액티비티 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "status": 200,
      "message": "액티비티 참여 성공",
      "data": null
    }
    ```
    
</aside>

<aside>
📍 액티비티 좋아요 **API**

- 설명 : 특정 액티비티에 좋아요(하트)를 추가합니다.
- 헤더
    - Authorization: Bearer {AccessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path | activityId | Y | Long | 좋아요를 누를 액티비티의 고유 ID |
- Request Sample
    
    ```json
    POST /api/v1/activities/1/likes
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 (좋아요 추가됨) |
| Error | 404 | 존재하지 않는 액티비티 ID |
| Error | 409 | 이미 좋아요를 누른 상태 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "status": 200,
      "message": "액티비티 좋아요 성공",
      "data": null
    }
    ```
    
</aside>

<aside>
📍 액티비티 좋아요 취소 **API**

- 설명 : 특정 액티비티에 누른 좋아요(하트)를 취소합니다.
- 헤더
    - Authorization: Bearer {AccessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path | activityId | Y | Long | 좋아요를 취소할 액티비티의 고유 ID |
- Request Sample
    
    ```json
    DELETE /api/v1/activities/1/likes
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 (좋아요 취소됨) |
| Error | 404 | 존재하지 않는 액티비티이거나 누른 적 없는 좋아요 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "status": 200,
      "message": "액티비티 좋아요 취소 성공",
      "data": null
    }
    ```
    
</aside>

<aside>
📍 액티비티 취소 **API**

- 설명 : 참여 중인 특정 액티비티에서 탈퇴(참여 취소)합니다.
- 헤더
    - Authorization: Bearer {AccessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path | activityId | Y | Long | 탈퇴할 액티비티의 고유 ID |
- Request Sample
    
    ```json
    DELETE /api/v1/activities/1/members
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 (참여 취소 완료) |
| Error | 400 | 주최자(생성자)는 취소할 수 없음 등 비즈니스 로직 에러 |
| Error | 404 | 참여한 적 없는 액티비티 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    
    ```
    
</aside>