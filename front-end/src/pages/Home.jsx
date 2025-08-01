import React from "react";
import Header from "../components/header";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/Newsletter";
import RecommendedHotels from "../components/RecommendedHotels";



export default function Home(){
    return(
        <>
        <Header/>
        {/* <RecommendedHotels/> */}
        <FeaturedDestination/>
        <ExclusiveOffers/>
        <Testimonial/>
        <Newsletter/>
        </>

    )
}