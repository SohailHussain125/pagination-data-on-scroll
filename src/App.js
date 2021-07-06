import React, { useEffect, useState } from 'react'
import './App.css';
import { useInView } from 'react-intersection-observer'
import Select from 'react-select';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

function App() {
  const [ref, inView] = useInView({
    threshold: 0,
  })


  const containerStyle = {
    display: "flex",
    justifyContent: "center",
  };
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setpagination] = useState({
    start: 0,
    limit: 5
  })


  const getTodos = () => {
    setIsLoading(true)
    fetch(`https://jsonplaceholder.typicode.com/todos?_start=${pagination.start}&_limit=${pagination.limit}`)
      .then(response => response.json())
      .then(json => {
        let newTodoList = json.map((todo) => {
          return {
            label: todo.title,
            value: todo.id
          }
        })
        newTodoList.push({
          label: <div ref={ref}>
            <p className="flex-center"><Loader
              type="Puff"
              color="#00BFFF"
              height={20}
              width={20}
            /></p></div>,
          value: "2",
          isDisabled: 'yes'
        })
        list.splice(list.length - 1, 1)
        setList([...list, ...newTodoList])
        setpagination({
          start: pagination.limit,
          limit: pagination.limit + 5
        })
        setIsLoading(false)
      }
      )
  }

  useEffect(() => {
    !list.length && getTodos()
    !list.length && setList([{
      label: <div ref={ref}>
        <p className="flex-center"><Loader
          type="Puff"
          color="#00BFFF"
          height={20}
          width={20}
        /></p></div>,
      value: "2",
      isDisabled: 'yes'
    }])
  }, [])
  useEffect(() => {
    !isLoading && inView && getTodos()
  }, [inView])

  return (

    <div style={{ ...containerStyle }}>
      <div style={{ width: "400px" }}>
        <div className="M-B-5">
          <label><strong >Todo List Select</strong></label>
        </div>
        <Select
          className="react-select info"
          classNamePrefix="react-select"
          placeholder={"Select Todos"}
          name={'Todos'}
          closeMenuOnSelect={false}
          onChange={(value) => console.log(value)}
          options={list}
          isMulti={true}
        />
      </div>
    </div>
  );
}

export default App;


