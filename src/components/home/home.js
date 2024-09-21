import { PLAY, WIKI } from "../configs/GOLButton.config";
import GitHubIcon from '@mui/icons-material/GitHub';
import GOLButton from "../GOLButton/GOLButton";
import "./css/home.css";
import { Tooltip } from "@mui/material";
import { useNavigate, useNavigation } from "react-router-dom";

export default function Home() {

    const githubRepo = 'https://github.com/sQuillP/Game-Of-Life';
    const wiki = 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life';

    const navigation = useNavigate();


    return (
        <div className="home silkscreen-regular">
            <div className="content">
                <div className="title">
                    <p className="home-subtitle text">Conway's</p>
                    <p className="home-title text">Game Of Life</p>
                </div>
                <div className="body">
                    <GOLButton onClick={()=> navigation("/play")} config={PLAY}/>
                    <GOLButton onClick={()=> window.open(wiki)} config={WIKI}/>
                </div>
                <div className="home-footer">
                    <p className="_golversion text silkscreen-regular">V_1.0</p>
                    <div className="icons">
                        <Tooltip title="View GitHub">
                            <button onClick={()=>window.open(githubRepo)} className="h-icon">
                                <i className="fa-brands fa-github"></i>
                            </button>
                        </Tooltip>
                        
                    </div>
                </div>
            </div>
        </div>
        
    )
}

{/* <button onClick={()=>window.open(wiki)} className="h-icon">
                        <i className="fa-brands fa-wikipedia-w"></i>
                    </button> */}