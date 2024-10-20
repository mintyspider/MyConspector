import React from 'react'

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

// ! TODO: add showing
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

const BlogContent = ({block}) => {
    let {type, data} = block;
  
    if (type == "paragraph"){
      return <p dangerouslySetInnerHTML={{__html: data.text}}></p>
    }
    if (type == "header"){
        if(data.level == 3){
          return <h3 className='text-3xl font-bold' dangerouslySetInnerHTML={{__html: data.text}}></h3>
        }
        if(data.level == 2){
          return <h2 className='text-4xl font-bold' dangerouslySetInnerHTML={{__html: data.text}}></h2>
        }
    }
    if (type == "image"){
      return <Img src={data.file.url} className='w-full' caption={data.caption}/>
    }
    if (type == "list"){
        return <List style={data.style} items={data.items}/>
    }
    if (type == "quote"){
        return <Quote quote={data.text} caption={data.caption}/>
    }
}

export default BlogContent