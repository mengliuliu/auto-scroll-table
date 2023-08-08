import React, { useEffect, useRef, useState } from "react"
// import './index.scss'
import { Spin } from "antd"
interface IProps {
  columns: any[]
  dataSource: any[]
}

function AutoScrollTable(props: IProps) {
  const { columns, dataSource } = props
  /** 是否滚动 */
  const [isScrolle, setIsScrolle] = useState(true)

  /** 滚动速度，值越小，滚动越快 */
  const speed = 100

  const warper: any = useRef<HTMLDivElement>(null)
  /** 原数据 */
  const childDom1: any = useRef<HTMLDivElement>(null)
  /** 拷贝数据 */
  const childDom2: any = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 判断是否需要滚动
    if (isScrolle && dataSource.length) {
      const scroll =
        warper.current.clientHeight < childDom1.current.clientHeight
      setIsScrolle(scroll)
    }
  }, [dataSource])

  //开始滚动
  useEffect(() => {
    // 多拷贝一层，让它无缝滚动
    childDom2.current.innerHTML = childDom1.current.innerHTML
    let timer: any

    if (isScrolle && dataSource.length) {
      timer = setInterval(() => {
        if (warper.current.scrollTop >= childDom1.current.scrollHeight) {
          warper.current.scrollTop = 0
        } else {
          warper.current.scrollTop += 3
        }
      }, speed)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isScrolle, dataSource])

  return (
    <>
      <div className={"tableStyle"}>
        {columns?.map((item, index) => {
          return <div>{item.title}</div>
        })}
      </div>
      <Spin spinning={dataSource.length ? false : true}>
        <div className={"parent"} ref={warper}>
          <div className={"child"} ref={childDom1}>
            {dataSource?.map((item, index) => {
              return (
                <div className={"tableStyle"} key={index}>
                  {columns.map((column, indey) => {
                    return (
                      <div>
                        {column.render
                          ? column.render(item[column.dataIndex], item)
                          : item[column.dataIndex]}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
          <div
            className={"child"}
            style={isScrolle ? {} : { display: "none" }}
            ref={childDom2}
          ></div>
        </div>
      </Spin>
    </>
  )
}

export default AutoScrollTable
