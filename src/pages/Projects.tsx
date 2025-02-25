import {useEffect, useState} from "react";

import {AppBox} from "@utils/AppBox";
import styles from "@styles/projects.module.scss";
import {
    AnimatePresence,
    motion,
} from "framer-motion";
import {useAppDispatch, useAppSelector} from "@/redux/store";
import {selectProjectFetching, selectProjects, selectTheme} from "@/redux/selector";
import {getProjects} from "@/redux/projectsSlice";
import {Link, Typography} from "@mui/material";
import {TbEye, TbEyeX} from "react-icons/tb";
import {MdExpandLess} from "react-icons/md";
import {DisplaySkills} from "@components/DisplaySkills";
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";
import {useInterval, useWindowSize} from "usehooks-ts";
import {getDateFromSeconds} from "@utils/getDateFromSeconds";
import {GitHub, TravelExplore} from "@mui/icons-material";
import {ProjectLoading} from "@components/animations/ProjectLoading";
import {LoadingText} from "@components/LoadingText";

const ProjectImageBackground = ({highlightImg, images}: {
    highlightImg: IMG,
    images: IMG[]
}) => {
    const [imgPointer, setImgPointer] = useState(-1)
    const theme = useAppSelector(selectTheme);
    const [direction, setDirection] = useState<'LEFT' | 'RIGHT'>('LEFT');
    const [canChange, setCanChange] = useState(true);
    useInterval(
        () => {
            if (!canChange) {
                setCanChange(true);
            }
        }
        , 1000)
    return (
        <>
            <AnimatePresence mode={'sync'} initial={false}>
                <motion.div
                    className={styles.ImageContainer}
                    key={imgPointer}
                    initial={{
                        x: direction === 'LEFT' ? '-105%' : '105%',
                    }}
                    animate={{
                        x: 0
                    }}
                    exit={{
                        x: direction === 'LEFT' ? '105%' : '-105%',
                    }}
                    transition={{
                        duration: 0.8,
                        ease: 'easeInOut',
                        type: 'tween',
                    }}
                >
                    {
                        imgPointer === -1 && highlightImg.src ?
                            <img className={'w-[100%] h-[100%] object-cover'}
                                 src={highlightImg.src}
                                 alt={'Description unavailable'}/>
                            :
                            imgPointer !== -1 && images[imgPointer].src ?
                                <img className={'w-[100%] h-[100%] object-cover'}
                                     src={images[imgPointer].src}
                                     alt={'Description unavailable'}/>
                                : null
                    }
                </motion.div>
            </AnimatePresence>
            <motion.div
                className={`${styles.ImageControl} left-[20px]`}
                whileHover={
                    {
                        scale: 1.3,
                    }
                }
                animate={{
                    transform: 'translateY(-50%)'
                }}

                onClick={
                    () => {
                        if (!canChange) return;
                        if (imgPointer === -1) {
                            setImgPointer(images.length - 1);
                        } else {
                            setImgPointer(imgPointer - 1);
                        }
                        setDirection('LEFT')
                        setCanChange(false);
                    }
                }
                style={{
                    backgroundColor: theme === "dark" ? 'rgba(0,0,0,0.8)' : "rgba(255,255,255,0.8)",
                    color: theme === "dark" ? 'white' : "black",
                }}
            >
                <AiOutlineLeft/>
            </motion.div>

            <motion.div
                className={`${styles.ImageControl} right-[20px]`}
                animate={{
                    transform: 'translateY(-50%)'
                }}
                whileHover={
                    {
                        scale: 1.3,
                    }
                }
                onClick={
                    () => {
                        if (imgPointer === images.length - 1) {
                            setImgPointer(-1);
                        } else {
                            setImgPointer(imgPointer + 1);
                        }
                        setDirection('RIGHT')
                    }
                }
                style={{
                    backgroundColor: theme === "dark" ? 'rgba(0,0,0,0.8)' : "rgba(255,255,255,0.8)",
                    color: theme === "dark" ? 'white' : "black",
                }}
            >
                <AiOutlineRight/>
            </motion.div>
        </>
    )
}


const Project = ({project, isOdd}: { project: Project, isOdd: boolean }) => {
    const [descriptionVisible, setDescriptionVisible] = useState(false);
    const [hideContent, setHideContent] = useState(false);
    const theme = useAppSelector(selectTheme);
    const {width} = useWindowSize();
    return (
        <div className={styles.Project}>
            <motion.div className={styles.ProjectContentContainer}
                        style={{
                            borderColor: theme === "dark" ? "white" : "black",
                        }}
                        initial={{
                            y: isOdd ? '100%' : '-100%',
                        }}
                        whileInView={
                            {
                                y: 0,
                            }
                        }
                        transition={
                            {
                                duration: 1.5,
                                type: "spring",
                                bounce: 0.5,
                            }
                        }>

                <div
                    className={styles.ProjectContent}
                >
                    <ProjectImageBackground
                        highlightImg={project.highlightImage}
                        images={project.images}/>
                    <motion.div
                        className={styles.ToggleIcon}
                        onClick={() => {
                            setHideContent(!hideContent);
                        }}
                        whileHover={{
                            scale: 1.3,
                        }}
                        style={{
                            backgroundColor: theme === "dark" ? 'rgba(0,0,0,0.8)' : "rgba(255,255,255,0.8)",
                            color: theme === "dark" ? 'white' : "black",
                        }}
                    >
                        {
                            hideContent ? <TbEye/> : <TbEyeX/>
                        }
                    </motion.div>

                    <motion.div
                        className={styles.Info}
                        style={
                            {
                                backgroundColor: theme === "dark" ? 'rgba(0,0,0,0.3)' : "rgba(255,255,255,0.3)",
                            }
                        }
                        animate={
                            {
                                top: hideContent ? '-100%' : 0,
                            }
                        }
                    >
                        <Typography
                            sx={{
                                backgroundColor: theme === "dark" ? "black" : "white",
                                padding: '5px',
                                borderRadius: '5px',
                                maxWidth: width < 400 ? '170px' : '250px'
                            }}
                            variant={'h6'}
                        >
                            {project.name}
                        </Typography>
                        <DisplaySkills skills={project.skills} maxSize={width < 400 ? '220px' : "315px"}/>
                        <div className={styles.Links}>
                            <div className={styles.Link}>
                                <GitHub/>
                                <Link className={styles.LinkText} href={project.github} target={'_blank'}>
                                    <Typography variant={'body1'}>Github Repo</Typography>
                                </Link>
                            </div>
                            {
                                project.html_url ?
                                    <div className={styles.Link}>
                                        <TravelExplore/>
                                        <Link className={styles.LinkText} href={project.html_url} target={'_blank'}>
                                            <Typography variant={'body1'}> Live Demo </Typography>
                                        </Link>
                                    </div>
                                    : null
                            }
                        </div>

                        <motion.div
                            className={styles.Description}
                            initial={{
                                top: width > 400 ? '70%' : '85%',
                                left: 0
                            }}
                            animate={
                                {
                                    top: descriptionVisible ? '25%' : width > 400 ? '70%' : '85%',
                                }
                            }
                        >
                            <div className={styles.DescToggleIconWrapper}
                                 style={{
                                     backgroundColor: theme === "dark" ? 'rgba(0,0,0,1)' : "rgba(255,255,255,1)",
                                 }}>
                                <Typography variant={'body1'}>
                                    {getDateFromSeconds(parseInt(project.created_at))}
                                </Typography>
                                <div className={styles.DescToggleIconContainer}>
                                    <motion.div
                                        className={styles.DescToggleIcon}
                                        onClick={() => {
                                            setDescriptionVisible(!descriptionVisible);
                                        }}
                                        style={{
                                            backgroundColor: theme === "dark" ? 'rgba(0,0,0,0.8)' : "rgba(255,255,255,0.8)",
                                            color: theme === "dark" ? 'white' : "black",
                                        }}
                                        whileHover={
                                            {
                                                scale: 1.3,
                                            }
                                        }
                                        animate={
                                            {
                                                rotate: descriptionVisible ? 180 : 0,
                                            }
                                        }
                                    >
                                        <MdExpandLess className={'w-[20px] h-[20px] m-0'}/>
                                    </motion.div>
                                </div>
                            </div>
                            <Typography
                                sx={{
                                    padding: "5px 10px 10px 10px",
                                    backgroundColor: theme === "dark" ? 'rgba(0,0,0,0.9)' : "rgba(255,255,255,0.9)",
                                    height: "220px",
                                    overflowY: "auto",
                                    "&::-webkit-scrollbar": {
                                        width: "0px"
                                    }
                                }}
                                variant={'body2'}
                            >{project.description}
                            </Typography>

                        </motion.div>
                    </motion.div>

                </div>
            </motion.div>

        </div>
    )
}

export function Projects() {

    const projects = useAppSelector(selectProjects);
    const isFetching = useAppSelector(selectProjectFetching);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (projects.length === 0) {
            dispatch(getProjects());
        }
    }, []);

    return (
        <AppBox className={styles.Wrapper}>

            <div className={styles.Container}>
                <div className={styles.Content}>
                    {isFetching ?
                        <motion.div
                            className={'w-[100%] h-[100%] flex justify-center items-center rotate-90 relative'}
                            initial={{opacity: 0,}}
                            animate={{opacity: 1,}}
                            transition={
                                {
                                    duration: 0.3,
                                    type: "tween",
                                    ease: "easeInOut"
                                }
                            }
                        >
                            <ProjectLoading/>
                            <LoadingText/>
                        </motion.div> :
                        projects.map((project, index) => <Project {...{isOdd: index % 2 == 0, project}}
                                                                  key={`${index} ${project.id}`}/>)
                    }
                </div>
            </div>
        </AppBox>
    )
}