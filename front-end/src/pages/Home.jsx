import React from "react";
import Header from "../components/header";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/Newsletter";



export default function Home(){
    return(
        <>
        <Header/>
        <FeaturedDestination/>
        <ExclusiveOffers/>
        <Testimonial/>
        <Newsletter/>
        </>

    )
}