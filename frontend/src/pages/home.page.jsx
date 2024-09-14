import React from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation from '../components/inpage-navigation.component'

const HomePage = () => {
  return (
    <AnimationWrapper>
        <section className='h-cover flex justify-center gap-10'>
            {/* Последние записи */}
            <div className='w-full'>
                <InPageNavigation routes={["Новое", "Популярное"]}></InPageNavigation>
            </div>
            {/* Фильтры и самые популярные конспекты */}
            <div></div>
        </section>
    </AnimationWrapper>
  )
}

export default HomePage
