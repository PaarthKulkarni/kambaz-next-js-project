"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaPlus, FaEllipsisV, FaRegFileAlt, FaCaretDown } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setQuizzes } from "../Quizzes/reducer";
import * as client from "../../client";

export default function Grades() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [quizStats, setQuizStats] = useState<any>({});

  const fetchQuizzes = async () => {
    if (!cid) return;
    const quizzes = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(quizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const filteredQuizzes = quizzes.filter(
    (q: any) =>
      q.course === cid &&
      q.published &&
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadStats = async () => {
      const stats: any = {};
      await Promise.all(
        filteredQuizzes.map(async (q: any) => {
          try {
            const attempts = await client.getStudentAttempts(q._id);
            const submittedAttempts = attempts.filter((a: any) => a.status === "SUBMITTED");
            let maxScore = 0;
            if (submittedAttempts.length > 0) {
                maxScore = Math.max(...attempts.map((a: any) => a.score));
            }

            stats[q._id] = {
                count: submittedAttempts.length,
                maxScore: maxScore
            };
          } catch (error) {
            console.error(error);
            stats[q._id] = { count: 0, maxScore: 0 };
          }
        })
      );
      setQuizStats(stats);
    };

    if (filteredQuizzes.length > 0) {
      loadStats();
    }
  }, [quizzes, cid]);

  return (
    <div id="wd-grades" className="p-4">
      <div className="d-flex justify-content-between mb-3">
        <div className="input-group me-2 w-50">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            className="form-control"
            placeholder="Search for Quizzes"
            id="wd-search-grade"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ListGroup className="rounded-0">
        <ListGroupItem variant="secondary" className="p-2">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 d-flex align-items-center">
              <BsGripVertical className="m-2 fs-4" />
              <span className="fw-bold text-uppercase m-2">GRADES</span>
              <FaCaretDown className="m-2" />
            </div>
            <div className="d-flex align-items-center">
              <span className="fw-bold align-items-center m-2">40% of Total</span>
              <FaPlus className="text-muted m-2" />
              <FaEllipsisV className="text-muted m-2" />
            </div>
          </div>
        </ListGroupItem>

        {filteredQuizzes.map((quiz: any) => {
          const stats = quizStats[quiz._id] || { count: 0, maxScore: 0 };

          return (
            <ListGroupItem
              key={quiz._id}
              className="wd-quiz-status-border p-2"
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center flex-grow-1">
                  <BsGripVertical className="me-2 fs-2" />
                  <FaRegFileAlt className="text-success me-3 fs-2" />
                  <div>
                    <Link
                      href={`/Courses/${cid}/Grades/${quiz._id}`}
                      className="wd-quiz-link text-decoration-none text-dark fw-bold"
                    >
                      {quiz.title}
                    </Link>
                    <div className="text-secondary fs-5">
                      {stats.count === 0 ? (
                        <span className="text-danger fw-bold">Not Attempted</span>
                      ) : (
                        <span className="text-success fw-bold">Attempts: {stats.count}</span>
                      )}
                      
                      <span className="fw-bold"> | Due </span>
                      {new Date(quiz.dueDate + "T00:00:00").toDateString().split(' ').slice(1).join(' ')} at {" "}
                      {new Date("2000-01-01 " + quiz.dueTime).toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric", hour12: true }) + " "} 
                      | {stats.count > 0 ? stats.maxScore : 0} / {quiz.points} pts | {quiz.questions.length} Questions
                    </div>
                  </div>
                </div>
              </div>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </div>
  );
}
