<aside>
📍 그룹 모집글 생성 **API**

- 설명 : 그룹 탭에서 생성
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| body | title | O | varchar | 그룹명 |
| body | category | O | varchar?enum? | 그룹 대표 카테고리 |
| body | capacity | O | int | 정원 |
| body | schedule | O | datetime | 모임 일정 |
| body | description | O | text | 모집글 설명 |
| body | Thumbnail | X | text | 그룹 썸네일 |
- Request Sample
    
    ```json
    {
      "title": "주말 한강 러닝 크루 모집",
      "category": "운동/스포츠",
      "capacity": 15,
      "schedule": "2026-04-15T10:00:00",
      "description": "매주 토요일 오전, 한강변을 함께 달릴 분들을 찾습니다! 초보자도 환영해요.",
      "thumbnail": "https://example.com/images/running_group_01.jpg"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 403 | 인증되었지만 권한이 없는 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess": true,
      "code": "GROUP2001",
      "message": "그룹 생성이 완료되었습니다.",
      "result": {
        "id": 101,
        "title": "주말 한강 러닝 크루 모집",
        "category": "운동/스포츠",
        "capacity": 15,
        "currentParticipants": 12,
        "isLiked": false,
        "likeCount": 127,
        "schedule": "2026-04-15T10:00:00",
        "description": "매주 토요일 오전 한강변을 함께 달릴 분들을 찾습니다! 초보자도 환영하며, 달린 후에는 근처 카페에서 간단한 티타임도 가질 예정입니다.",
        "thumbnail": "https://example.com/images/running.jpg",
        "members": [
          { "name": "Alex Kim", "profileImageUrl": "url1", "major": "Software Engineering" }
        ]
      }
    }
    ```
    
</aside>

<aside>
📍 그룹 모집글 수정 **API**

- 설명 : 그룹장만 모집글을 수정할 수 있습니다.
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path Variable | id | O | int | 그룹 아이디 |
| body | title | O | varchar | 그룹명 |
| body | category | O | varchar?enum? | 그룹 대표 카테고리 |
| body | capacity | O | int | 정원 |
| body | schedule | O | datetime | 모임 일정 |
| body | description | O | text | 모집글 설명 |
| body | Thumbnail | X | text | 그룹 썸네일 |
- Request Sample
    
    ```json
    {
      "title": "주말 한강 러닝 크루 모집",
      "category": "운동/스포츠",
      "capacity": 15,
      "schedule": "2026-04-15T10:00:00",
      "description": "매주 토요일 오전, 한강변을 함께 달릴 분들을 찾습니다! 초보자도 환영해요.",
      "thumbnail": "https://example.com/images/running_group_01.jpg"
    }
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 403 | 인증되었지만 권한이 없는 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess": true,
      "code": "GROUP2002",
      "message": "그룹 생성이 완료되었습니다.",
      "result": {
        "id": 101,
        "title": "주말 한강 러닝 크루 모집",
        "category": "운동/스포츠",
        "capacity": 15,
        "currentParticipants": 12,
        "isLiked": false,
        "likeCount": 127,
        "schedule": "2026-04-15T10:00:00",
        "description": "매주 토요일 오전 한강변을 함께 달릴 분들을 찾습니다! 초보자도 환영하며, 달린 후에는 근처 카페에서 간단한 티타임도 가질 예정입니다.",
        "thumbnail": "https://example.com/images/running.jpg",
        "members": [
          { "name": "Alex Kim", "profileImageUrl": "url1", "major": "Software Engineering" },
          { "name": "Jane Doe", "profileImageUrl": "url2", "major": "Design" },
          { "name": "Chris Park", "profileImageUrl": "url3", "major": "Business" },
          { "name": "Lee Minho", "profileImageUrl": "url4", "major": "AI" }
        ]
      }
    }
    ```
    
</aside>

<aside>
📍 그룹 삭제 **API**

- 설명 : 그룹장 판단하에 그룹을 삭제할 수 있습니다
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path variable | groupId | O | int | 그룹 아이디 |
- Request Sample
    
    ```json
    
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 403 | 인증되었지만 권한이 없는 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess": true,
      "code": "GROUP2003",
      "message": "그룹 삭제에 성공했습니다.",
      "result": {
        "id": 101
      }
    }
    ```
    
</aside>


<aside>
📍 그룹 모집글 목록 조회 **API**

- 설명 : 그룹탭에서 모든 모집글의 목록을 조회할 수 있습니다. 인기, 가용한 그룹, 카테고리별로 조회할 수 있습니다.
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Query String | category | X | varchar?enum? | 카테고리 필터링 |
| Query String | sortBy | X | enum | 인기 그룹, 참여 가능 그룹 필터링 |
| Query String | isAvailable | X | boolean | 참여 가능 그룹만 조회 |
| Query String | cursor | X | int | 커서 페이징 |
- Request Sample
    
    ```json
    
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 403 | 인증되었지만 권한이 없는 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess": true,
      "code": "GROUP2004",
      "message": "그룹 목록 조회에 성공했습니다.",
      "result": {
        "groupList": [
          {
            "id": 101,
            "title": "주말 한강 러닝 크루",
            "category": "운동/스포츠",
            "capacity": 15,
            "currentParticipants": 12,
            "isLiked": false,
    		    "likeCount": 127,
            "thumbnail": "https://example.com/images/running.jpg",
            "members": [
              { "name": "Alex", "profileImageUrl": "url1" },
              { "name": "Jane", "profileImageUrl": "url2" },
              { "name": "Chris", "profileImageUrl": "url3" }
            ]
          }
        ],
        "nextCursor": 98,
        "hasMore": true
      }
    }
    ```
    
</aside>

<aside>
📍 그룹 모집글 상세 조회 **API**

- 설명 : 그룹탭에서 선택한 그룹의 상세 정보를 조회합니다.
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path Variable | groupId | O | int | 그룹 아이디 |
- Request Sample
    
    ```json
    
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 403 | 인증되었지만 권한이 없는 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess": true,
      "code": "GROUP2005",
      "message": "그룹 상세 정보를 조회했습니다.",
      "result": {
        "id": 101,
        "title": "주말 한강 러닝 크루 모집",
        "category": "운동/스포츠",
        "capacity": 15,
        "currentParticipants": 12,
        "isLiked": false,
        "likeCount": 127,
        "schedule": "2026-04-15T10:00:00",
        "description": "매주 토요일 오전 한강변을 함께 달릴 분들을 찾습니다! 초보자도 환영하며, 달린 후에는 근처 카페에서 간단한 티타임도 가질 예정입니다.",
        "thumbnail": "https://example.com/images/running.jpg",
        "members": [
          { "name": "Alex Kim", "profileImageUrl": "url1", "major": "Software Engineering" },
          { "name": "Jane Doe", "profileImageUrl": "url2", "major": "Design" },
          { "name": "Chris Park", "profileImageUrl": "url3", "major": "Business" },
          { "name": "Lee Minho", "profileImageUrl": "url4", "major": "AI" }
        ]
      }
    }
    ```
    
</aside>

<aside>
📍 그룹 참여 신청 **API**

- 설명 : 선택한 그룹에 참여 신청합니다.
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path Variable | groupId | O | int | 그룹 아이디 |
- Request Sample
    
    ```json
    
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 403 | 인증되었지만 권한이 없는 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess": true,
      "code": "GROUP2006",
      "message": "그룹 참여가 완료되었습니다.",
      "result": {
        "groupId": 101
      }
    }
    ```
    
</aside>
<aside>
📍  그룹 인원 상세정보 조회 **API**

- 설명 : 해당 그룹에서 선택한 사람의 상세 페이지의 데이터를 반환합니다.
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path Variable | groupId | O | int | 그룹 아이디 |
| Path Variable | memberId | O | int | 멤버 아이디 |
- Request Sample
    
    ```json
    
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 403 | 인증되었지만 권한이 없는 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess": true,
      "code": "GROUP2007",
      "message": "그룹 멤버 상세 정보 조회가 완료되었습니다.",
      "result": {
        "userId": 12345,
        "name": "Jun-ho Park",
        "major": "Computer Science & Engineering",
        "department": "College of AI & Software",
        "academicVerified": true,
        "profileImageUrl": "https://cdn.example.com/profiles/junho_park.png",
        "introduction": "Computer Science & Engineering student at Gachon University.",
        "keywords": [
          "Back-end",
          "Gaming",
          "Python",
          "Cloud"
        ],
        "languages": [
          "Korean",
          "English"
        ],
        "expertiseAreas": [
          {
            "area": "System Architecture",
            "level": "Advanced Proficiency"
          },
          {
            "area": "Data Engineering",
            "level": "Intermediate Level"
          }
        ], // 이건 필요 없을거같음
        "currentGroups": [
          {
            "groupId": 201,
            "title": "Gachon Buddy AI",
            "description": "Campus assistant chatbot utilizing LLM fine-..."
          },
          {
            "groupId": 205,
            "title": "Blockchain Voting",
            "description": "Secure student council voting with Ethereum..."
          }
        ],
        "totalGroupCount": 3
      }
    }
    ```
    
</aside>

<aside>
📍 그룹 좋아요 **API**

- 설명 : 선택한 그룹에 좋아요를 추가/등록합니다
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path Variable | groupId | O | int | 그룹 아이디 |
- Request Sample
    
    ```json
    
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 403 | 인증되었지만 권한이 없는 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess": true,
      "code": "GROUP2008",
      "message": "그룹 좋아요 처리가 완료되었습니다.",
      "result": {
        "groupId": 101,
        "isLiked": true,
        "likeCount": 128,
        "updatedAt": "2026-03-30T13:25:10"
      }
    }
    ```
    
</aside>

<aside>
📍 그룹 좋아요 취소 **API**

- 설명 : 선택한 그룹의 좋아요를 취소합니다.
- 헤더
    - Authorization: Bearer {accessToken}

**Request Body**

| 요청 종류 | 필드 이름 | 필수 여부 | 타입 | 설명 |
| --- | --- | --- | --- | --- |
| Path Variable | groupId | O | int | 그룹 아이디 |
- Request Sample
    
    ```json
    
    ```
    

**Response Body**

| 성공여부 | 응답코드 | 설명 |
| --- | --- | --- |
| Success | 200 | 응답 성공 |
| Error | 400 | 잘못된 요청값 |
| Error | 401 | 인증되지 않은 사용자 |
| Error | 403 | 인증되었지만 권한이 없는 사용자 |
| Error | 500 | 서버 내부 오류 |
- Response Sample
    
    ```json
    {
      "isSuccess": true,
      "code": "GROUP2009",
      "message": "그룹 좋아요 취소에 성공했습니다.",
      "result": {
        "groupId": 101,
        "isLiked": false,
        "likeCount": 127,
        "updatedAt": "2026-03-30T13:32:15"
      }
    }
    ```
    
</aside>

<aside>
📍 000 **그룹 댓글 기능 API**

- 설명 : 세부적인 것은 아직 정해지지 않음
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