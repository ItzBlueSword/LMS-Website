import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEndrolledCourses] = useState([])

    // Fetch All Courses
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    };

    // Calculate average rating of a course
    const calculateRating = (course) => {
        if (!course || !Array.isArray(course.courseRatings) || course.courseRatings.length === 0) return 0;

        const totalRating = course.courseRatings.reduce((sum, rating) => sum + (rating.rating || 0), 0);
        return totalRating / course.courseRatings.length;
    };

    // Calculate time of a single chapter
    const calculateChapterTime = (chapter) => {
        if (!chapter || !Array.isArray(chapter.chapterContent)) return '0h 0m';

        const time = chapter.chapterContent.reduce((sum, lecture) => sum + (lecture.lectureDuration || 0), 0);
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    // Calculate total duration of a course
    const calculateCourseDuration = (course) => {
        if (!course || !Array.isArray(course.courseContent)) return '0h 0m';

        let totalTime = 0;
        course.courseContent.forEach((chapter) => {
            if (!chapter.chapterContent || !Array.isArray(chapter.chapterContent)) return;
            chapter.chapterContent.forEach((lecture) => {
                totalTime += lecture.lectureDuration || 0;
            });
        });

        return humanizeDuration(totalTime * 60 * 1000, { units: ["h", "m"] });
    };

    // Calculate total number of lectures in a course
    const calculateNoOfLectures = (course) => {
        if (!course || !Array.isArray(course.courseContent)) return 0;

        return course.courseContent.reduce((total, chapter) => {
            if (!chapter.chapterContent || !Array.isArray(chapter.chapterContent)) return total;
            return total + chapter.chapterContent.length;
        }, 0);
    };

    // Fetch User Enrolled Courses
    const fetchUserEnrolledCourses = async ()=>(
        setEndrolledCourses(dummyCourses)
    )

    useEffect(() => {
        fetchAllCourses()
        fetchUserEnrolledCourses()
    }, []);

    const value = {
        currency,
        allCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateNoOfLectures,
        calculateCourseDuration,
        calculateChapterTime,
        enrolledCourses,
        fetchUserEnrolledCourses
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
