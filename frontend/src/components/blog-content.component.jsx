import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const Img = ({src, caption}) => {
    return (
        <div>
            <img src={src} className='w-full'/>
            {
                caption.length ? <p className='w-full my-3 md:mb-12 text-base text-dark-grey text-center'>{caption}</p> 
                : null
            }
        </div>
    )
}

const Quote = ({quote, caption}) => {
    return (
        <div className='bg-purple/10 p-3 pl-5 botder-l-4 border-purple'>
            <p className='text-xl md:text-2xl leading-10' dangerouslySetInnerHTML={{__html: quote}}></p>
            {
                caption.length ? <p className='w-full text-base text-purple' dangerouslySetInnerHTML={{__html: caption}}></p> 
                : null
            }
        </div>
    )
}

const List = ({style, items}) => {
    return (
        <ol className={(style == "ordered" ? "list-decimal " : "list-disc ") + "pl-5"}>
            {
                items.map((item, index) => {
                    return <li key={index} className='my-4' dangerouslySetInnerHTML={{__html: item}}></li>
                })
            }
        </ol>
    )
}

const Nestedlist = ({ style, items }) => {
    return (
        <ol className={(style === "ordered" ? "list-decimal " : "list-disc ") + "pl-5"}>
        {items.map((item, index) => (
            <li key={index} className="my-4">
            {/* Используем dangerouslySetInnerHTML, если item - это строка с HTML */}
            {typeof item === "string" ? (
                <span dangerouslySetInnerHTML={{ __html: item }}></span>
            ) : (
              // Если item - объект, содержащий текст и вложенные элементы, рекурсивно рендерим вложенный список
                <>
                    <span dangerouslySetInnerHTML={{ __html: item.text }}></span>
                    {item.children && item.children.length > 0 && (
                        <List style={style} items={item.children} />
                    )}
                </>
            )}
            </li>
        ))}
        </ol>
    );
};

const Table = ({ data }) => {
    if (!data || !data.content || data.content.length === 0) return null;

    // Separate headers and rows from the content
    const headers = data.content[0];
    const rows = data.content.slice(1);

    return (
        <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="border border-dark-grey bg-purple/20 px-4 py-2 font-semibold text-center ">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border border-dark-grey px-4 py-2">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
const Checklist = ({ data }) => {
    return (
        <ul className="pl-5">
            {data.items.map((item, index) => (
                <li key={index} className="my-4 flex items-center">
                    <span className="mr-2">
                        {item.checked ? (
                            <span className="text-green-500">✔️</span> // Checked
                        ) : (
                            <span className="text-gray-500">⬜</span> // Unchecked
                        )}
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: item.text }}></span>
                </li>
            ))}
        </ul>
    );
};

const MathRenderer = ({ expression }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (expression && containerRef.current) {
            try {
                katex.render(expression, containerRef.current, {
                    throwOnError: false,
                    displayMode: true, // Используется для блочного отображения
                });
            } catch (error) {
                console.error("Ошибка при рендеринге математического выражения:", error);
                containerRef.current.innerHTML = "Ошибка рендеринга";
            }
        }
    }, [expression]);

    return <span ref={containerRef}></span>;
};


function BlogContent({ block }) {
    let { type, data } = block

    if (type == "paragraph") {
        return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>
    }
    if (type == "header") {
        if (data.level == 3) {
            return <h3 className='text-3xl font-bold' dangerouslySetInnerHTML={{ __html: data.text }}></h3>
        }
        if (data.level == 2) {
            return <h2 className='text-4xl font-bold' dangerouslySetInnerHTML={{ __html: data.text }}></h2>
        }
    }
    if (type == "image") {
        return <Img src={data.file.url} className='w-full' caption={data.caption} />
    }
    if (type == "list") {
        return <List style={data.style} items={data.items} />
    }
    if (type == "nested-list") {
        return <Nestedlist style={data.style} items={data.items} />
    }
    if (type == "quote") {
        return <Quote quote={data.text} caption={data.caption} />
    }
    if (type == "code") {
        return <pre className='bg-purple/10 p-3 text-dark-grey rounded-md'><code dangerouslySetInnerHTML={{ __html: data.code }}></code></pre>
    }
    if (type == "warning") {
        return <div className='bg-red/10 p-3 rounded-md'>
            <p className="text-2xl text-red font-semibold flex items-center">
                <span className="mr-2 text-red-500">❗️</span>
                <span dangerouslySetInnerHTML={{ __html: data.title }}></span>
            </p>
            <p className='text-xl md:text-2xl' dangerouslySetInnerHTML={{ __html: data.message }}></p>
        </div>
    }
    if (type == "checklist") {
        return <Checklist data={data} />
    }
    if (type == "table") {
        return <Table data={data} />
    }
    if (type == "delimiter") {
        return <div className='w-full h-1 text-3xl text-center'>***</div>
    }
    if (type == "Math"){
        return <MathRenderer expression={data.math} />
    }
}

export default BlogContent