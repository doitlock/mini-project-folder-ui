import React, { useState, useEffect } from 'react';

function TodoList() {
    // usetate: 기억해야 할 값(상태)
    const [inputValue, setInputValue] = useState(''); 
    

    // 전체, 완료, 미완료 필터
    const [filter, setFilter] = useState<'all' | 'done' | 'undone'>('all');
    // useState<...>(): TS의 제네릭 문법. 상태의 타입이 무엇인지 명시!
    // 이 state는 'all'을 기본값을 가진 상태. 값은 'all', 'done', 'undone' 세가지 문자열 중 하나여야 한다.
    // ('all'): 초기값
    
    
    // 투두리스트에 완료 체크버튼 추가 (text + done 구조)
    type Todo = { 
        text: string;
        done: boolean;
        createdAt: string;
        isEditing?: string; //수정 중 여부
    };
    
    // 투두리스트 배열
    const [todos, setTodos] = useState<Todo[]>([]);
    // setTodos: todos 상태를 업데이트하는 함수. 화면도 갱신
    // const [todos, setTodos] = useState<string[]>([]); // 완료 체크버튼 추가 전. 이걸 위처럼 객체 배열로 바꿔야 완료 여부 저장 가능.


    // 투두리스트 수정중인 항목을 구분하는 상태값
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // 수정 중인 항목 인덱스
    const [editValue, setEditValue] = useState<string>(''); // 수정할 텍스트 입력 값

    // 수정버튼 클릭하면 상태 업데이트
    const handleEdit = (index: number) => {
        setEditingIndex(index);         // 몇 번째 항목을 수정 중인지 저장
        setEditValue(todos[index].text); // 기존 값으로 입력 필드 채우기
    };

    // 수정완료 버튼 클릭 시 저장 기능
    const handleEditSave = () => {
        if (editingIndex === null) return;

        const newTodos = [...todos];
        newTodos[editingIndex] = {
            ...newTodos[editingIndex],
            text: editValue
        };

        setTodos(newTodos);
        setEditingIndex(null);
        setEditValue('');
    };






    // 초기값: localStorage에서 불러오기
    useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            try {
                setTodos(JSON.parse(storedTodos));
            } catch (e) {
                console.error("저장된 todos 파싱 오류", e);
            }
        }
    }, []);
    // localStorage.getItem('todos'): 문자열로 저장된 json 가져옴
    // JSON.parse(storedTodos): 문자열을 js 객체/배열로 변환
    // setTodos: 변환된 배열을 todos에 적용. 즉 '문자열'을 [{ text: '...', done: false }, ...] 로 바꾼 후 → todos에 넣는 과정
    // catch (e): 예외를 잡아냄. 에러 로그를 보기 위해 출력하는 코드임.

    
    // 변경 시: localStorage에 저장 (자동 저장 기능 같은)
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);
    // todos 배열이 변경될 때마다 실행되는 함수 등록. 할일 추가, 삭제, 완료체크 하면 이 함수 실행
    // localStorage.setItem('todos',...): 브라우저의 로컬스토리지에 'todos'라는 이름으로 데이터 저장
    // JSON.stringify(todos): todos는 js 객체 배열이므로, 문자열로 변환해서 저장. (로컬스토리지는 문자열만 저장 가능)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        setInputValue(e.target.value); 
    };
    // 입력 필드의 값이 변경될 때 호출되는 함수: e는 event객체임. input에 뭔가 입력될 때마다 실행! 호출될 때 전달받은 e안에 입력창에 대한 정보가 있음
    // e.target.value를 통해서 사용자가 입력한 현재 텍스트값을 꺼냄. 그걸 setInputValue에 넣어서 inputValue 상태를 최신값으로 갱신.


    // 투두추가
    const handleAdd = () => {
        if (inputValue.trim() === '') return;
        setTodos([...todos, { text: inputValue, done: false, createdAt: new Date().toLocaleString(), }]); 
        setInputValue(''); // 입력 필드 초기화
    };
    // 빈 문자열은 추가하지 않음: trim은 문자열 앞뒤 공백을 제거!
    // 기존 todos에 새로운 todo 추가. todos는 현재 배열임. ...은 스프레드 문법임. 하나씩 펼쳐서 복사하는. 기존 배열을 직접 수정하는게 아님. 새로운 배열을 만들어서 업데이트 하는 거임. (ex ['밥먹기', '공부하기', inputValue])


    // 투두완료체크토글 (onclick 이벤트로 실행됨)
    const handleToggle = (index: number) => {
        const newTodos = todos.map((todo, i) => 
            i === index ? { ...todo, done: !todo.done } : todo 
        );
        setTodos(newTodos); 
    };
    // 클릭한 항목의 인덱스가 매개변수로 전달
    // map: 배열의 각 요소를 변환해서 기존 todos배열을 새로운 배열로 만듦.
    // map: 새로운 배열을 변환. jsx렌더링에 특화. foreach랑 비슷하다고 생각했는데 이건 반환을 아무것도 안 함.
    // 여기서는 todo.done을 반전시켜서 완료 상태를 토글함. i는 현재 인덱스임. i가 index와 같으면 해당 todo의 done 상태를 반전시킴. 그렇지 않으면 기존 todo를 그대로 반환.
    // 반환된 새 배열을 newTodos에 저장하고, setTodos로 상태 업데이트


    
    // 투두삭제
    const handleDelete = (index: number) => {
        setTodos(todos.filter((_, i) => i !== index));
    };
    // filter: 배열의 각 요소를 순회하면서 조건에 맞는 요소만 남김. 기존 배열인 todos 는 절대 변경되지 않음
    // filter 콜백 함수는 2개의 인자값을 받음. 첫번째 인자는 현재 요소(여기서는 사용하지 않아서 _로 표기함), 두번째 인자는 현재 인덱스.
    // i !== index 는 삭제하려는 인덱스가 아닌 요소만 남긴다는 뜻

    // *** 아래는 filter를 사용하지 않고 splice로 삭제하는 방법 ***
    // const handleDelete = (index: number) => {
    //     const newTodos = [...todos]; // 현재 todos 배열을 복사해서 새로운 배열 생성: 리액트에서는 기존 배열을 직접 수정하지 않고, 복사한 후 작업해야 리렌더링이 정상 동작.
    //     newTodos.splice(index, 1); // 해당 인덱스의 todo 삭제: newTodos[1]이 삭제됨
    //     setTodos(newTodos); // 상태 업데이트: 수정된 newTodos 배열을 최신 상태로 저장
    // };



    // 투두 목록 필터링
    const filteredTodos = todos.filter((todo) => {
        if (filter === 'done') return todo.done;
        if (filter === 'undone') return !todo.done;
        return true; // filter === 'all'
    });


    // 투두 리스트 수정
    


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
        1.일반적으로 맨 위 상단에 useState(상태 선언)를 먼저 작성. (컴포넌트의 핵심 상태)
        2.useEffect(생명주기 및 side effect 처리)를 작성. (부수효과가 무엇인지)
        3.핸들러 함수(사용자 정의 함수. 이벤트 처리)를 작성. (로직과 화면을 분리)
        4. return문 안에 JSX 작성.
    */
    
    
    
    return (
        <div className="todo-app">
            <h1>나의 TODOLIST</h1>
            <div className="todo-input-wrap">
                <input type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="할 일 입력하셈"
                    className="todo-input"
                />
                <button onClick={handleAdd} className="todo-add-btn">추가</button>
            </div>

            <div className="filter-btn-list">
                <button onClick={() => setFilter('all')}>전체</button>
                <button onClick={() => setFilter('done')}>완료</button>
                <button onClick={() => setFilter('undone')}>미완료</button>
            </div>

            <ul className="todo-list">
                {filteredTodos.map((todo, idx) => (
                    <li key={idx} className="todo-item">
                        {/* <span className={`todo-text ${todo.done ? 'done' : ''}`}>{todo.text}</span> */}

                        {editingIndex === idx ? (
                            <>
                                <input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                                <button onClick={handleEditSave}>저장</button>
                            </>
                            ) : (
                            <>
                                <span className={`todo-text ${todo.done ? 'done' : ''}`}>{todo.text}</span>
                                <button onClick={() => handleEdit(idx)}>수정</button>
                            </>
                        )}

                        <span className="todo-time">{todo.createdAt}</span>
                        <button className="todo-delete-btn" onClick={() => handleToggle(idx)}>완료</button>
                        <button className="todo-delete-btn" onClick={() => handleDelete(idx)}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TodoList;