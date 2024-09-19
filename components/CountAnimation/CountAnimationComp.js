import React from 'react';
import styles from './CountAnimation.module.css'
import { animated, useSpring } from '@react-spring/web'

const CountAnimationComp = ({ n }) => {
    const {number} = useSpring({
        from:{number:0},
        number:n,
        delay:10,
        config:{mass:1, tension:20,friction:10}
    })

    return <animated.div>{number.to((n)=>n.toFixed(0))}</animated.div>
}


export default CountAnimationComp;