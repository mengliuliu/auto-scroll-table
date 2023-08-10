import React, { useEffect, useRef, useState } from "react"
import { Spin } from "antd"
import "./index.scss"

interface IProps {
  config?: {
    bgColor: string
    height: string
  }
  columns: any[]
  dataSource: any[]
}

function AutoScrollTable(props: IProps) {
  const { config, columns, dataSource } = props
  /** 是否滚动 */
  const [isScrolle, setIsScrolle] = useState(true)

  /** 滚动速度，值越小，滚动越快 */
  const speed = 1000

  const warper: any = useRef<HTMLDivElement>(null)
  /** 原数据 */
  const childDom1: any = useRef<HTMLDivElement>(null)
  /** 拷贝数据 */
  const childDom2: any = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 初始判断是否需要滚动
    if (dataSource.length) {
      const scroll =
        warper.current.clientHeight < childDom1.current.clientHeight
      setIsScrolle(scroll)
    }
  }, [])

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
    <div
      style={{
        backgroundColor: config?.bgColor,
      }}
    >
      {/* 表格标题 */}
      <div className={"table"}>
        {columns?.map((item, index) => {
          return <div>{item.title}</div>
        })}
      </div>
      {/* 表格内容 */}
      <Spin spinning={dataSource.length ? false : true}>
        <div
          className={"parent"}
          style={{
            height: config?.height + "px",
          }}
          ref={warper}
        >
          <div className={"child"} ref={childDom1}>
            {dataSource?.map((item, index) => {
              return (
                <div className={"table"} key={index}>
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
    </div>
  )
}

export default AutoScrollTable
