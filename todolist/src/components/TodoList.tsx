import React, { useState } from 'react';

function TodoList() {
    const [inputValue, setInputValue] = useState(''); //usetate: 기억해야 할 값(상태)
    // const [todos, setTodos] = useState<string[]>([]); // 완료 체크버튼 추가 전

    type Todo = { // 투두리스트에 완료 체크버튼 추가
        text: string;
        done: boolean;
    };

    const [todos, setTodos] = useState<Todo[]>([]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // 입력 필드의 값이 변경될 때 호출되는 함수: e는 event객체임. input에 뭔가 입력될 때마다 실행! 호출될 때 전달받은 e안에 입력창에 대한 정보가 있음
        setInputValue(e.target.value); // e.target.value를 통해서 사용자가 입력한 현재 텍스트값을 꺼냄. 그걸 setInputValue에 넣어서 inputValue 상태를 최신값으로 갱신.
    };

    const handleAdd = () => {
        if (inputValue.trim() === '') return; // 빈 문자열은 추가하지 않음: trim은 문자열 앞뒤 공백을 제거!
        setTodos([...todos, { text: inputValue, done: false }]); // 기존 todos에 새로운 todo 추가. todos는 현재 배열임. ...은 스프레드 문법임. 하나씩 펼쳐서 복사하는. 기존 배열을 직접 수정하는게 아님. 새로운 배열을 만들어서 업데이트 하는 거임. (ex ['밥먹기', '공부하기', inputValue])
        setInputValue(''); // 입력 필드 초기화
    };

    const handleToggle = (index: number) => { // 클릭한 항목의 인덱스가 매개변수로 전달
        const newTodos = todos.map((todo, i) => // map: 배열의 각 요소를 변환해서 기존 todos배열을 새로운 배열로 만듦.
            i === index ? { ...todo, done: !todo.done } : todo // 여기서는 todo.done을 반전시켜서 완료 상태를 토글함. i는 현재 인덱스임. i가 index와 같으면 해당 todo의 done 상태를 반전시킴. 그렇지 않으면 기존 todo를 그대로 반환.
        );
        setTodos(newTodos); // 반환된 새 배열을 newTodos에 저장하고, setTodos로 상태 업데이트
    };

    // const handleDelete = (index: number) => {
    //     const newTodos = [...todos]; // 현재 todos 배열을 복사해서 새로운 배열 생성: 리액트에서는 기존 배열을 직접 수정하지 않고, 복사한 후 작업해야 리렌더링이 정상 동작.
    //     newTodos.splice(index, 1); // 해당 인덱스의 todo 삭제: newTodos[1]이 삭제됨
    //     setTodos(newTodos); // 상태 업데이트: 수정된 newTodos 배열을 최신 상태로 저장
    // };

    
    // 위 코드를 filter 사용해서 간단하게 변경
    const handleDelete = (index: number) => {
        setTodos(todos.filter((_, i) => i !== index));
    };

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

            <ul className="todo-list">
                {todos.map((todo, idx) => ( // map: 새로운 배열을 변환. jsx렌더링에 특화. foreach랑 비슷하다고 생각했는데 이건 반환을 아무것도 안 함.
                    <li key={idx} className="todo-item">
                        <span className={`todo-text ${todo.done ? 'done' : ''}`}>
                            {todo.text}
                        </span>
                        <button className="todo-delete-btn" onClick={() => handleToggle(idx)}>완료</button>
                        <button className="todo-delete-btn" onClick={() => handleDelete(idx)}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TodoList;