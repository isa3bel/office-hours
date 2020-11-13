import { CheckOutlined, CloseOutlined, UndoOutlined } from "@ant-design/icons";
import { API } from "@koh/api-client";
import {
  ClosedQuestionStatus,
  LimboQuestionStatus,
  Question,
  QuestionStatus,
} from "@koh/common";
import { Col, Popconfirm, Row } from "antd";
import { ReactElement } from "react";
import styled from "styled-components";
import AvatarWithInitals from "../../common/AvatarWithInitials";
import Banner, {
  RequeueButton,
  TABannerButton,
  TABannerDangerButton,
} from "../Banner";

const Bold = styled.span`
  font-weight: bold;
`;
const InfoHeader = styled.div`
  font-weight: bold;
  font-size: 14px;
  font-variant: small-caps;
  line-height: 1;
`;
const Info = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
`;

interface TABannerProps {
  helpingQuestion: Question;
  updateQuestion: (question: Question, status: QuestionStatus) => Promise<void>;
}
export default function TABanner({
  helpingQuestion,
  updateQuestion,
}: TABannerProps): ReactElement {
  const alertStudent = async () =>
    await API.questions.notify(helpingQuestion.id);

  return (
    <Banner
      titleColor="#3684C6"
      contentColor="#ABD4F3"
      title={
        <span>
          You are helping <Bold>{helpingQuestion.creator.name}</Bold>
        </span>
      }
      content={
        <Row>
          <Col flex="88px">
            {
              //TODO: bring back photo URL && get rid of RegeX
              //icon={<UserOutlined />}
              //src={helpingQuestion.creator.photoURL}
            }
            <AvatarWithInitals
              size={64}
              fontSize={36}
              name={helpingQuestion.creator.name}
            />
          </Col>
          <Col>
            <InfoHeader>question</InfoHeader>
            <Info>{helpingQuestion.text ?? ""}</Info>
            <InfoHeader>type</InfoHeader>
            <Info>{helpingQuestion.questionType ?? ""}</Info>
            <InfoHeader>email</InfoHeader>
            <Info>{helpingQuestion.creator.email ?? ""}</Info>
          </Col>
        </Row>
      }
      buttons={
        <>
          <Popconfirm
            title="Are you sure you want to requeue this student?" //TODO: text sucks
            okText="Yes"
            cancelText="No"
            onConfirm={async () => {
              await updateQuestion(
                helpingQuestion,
                LimboQuestionStatus.ReQueueing
              );
            }}
          >
            <RequeueButton icon={<UndoOutlined />}>
              Requeue Student
            </RequeueButton>
          </Popconfirm>
          <Popconfirm
            title="Are you sure you can't find this student??" // TODO: text
            okText="Yes"
            cancelText="No"
            onConfirm={async () => {
              await updateQuestion(
                helpingQuestion,
                LimboQuestionStatus.CantFind
              );
              await alertStudent();
            }}
          >
            <TABannerDangerButton
              icon={<CloseOutlined />}
              data-cy="remove-from-queue"
            >
              Can&apos;t Find
            </TABannerDangerButton>
          </Popconfirm>
          <TABannerButton
            icon={<CheckOutlined />}
            onClick={() =>
              updateQuestion(helpingQuestion, ClosedQuestionStatus.Resolved)
            }
          >
            Finish Helping
          </TABannerButton>
        </>
      }
    />
  );
}
