import { Request, Response } from "express";
import messages from "../../common/constants/messages";
import { ElectionResultType } from "../../common/types/electionResultType";
import { voteRecordType } from "../../common/types/voteRecordTypes";
import { getAllCandidates } from "../../services/admin/adminCandidateService";
import { homomorphicEncryption } from "../../services/cryptography/homomorphicService";
import {
  generateCurrentEncryptedResults,
  storeEncryptedRecordInBlockchian,
} from "../../services/results/electionResultService";
import {
  castVoteWithBlockchian,
  hasVoterVoted,
} from "../../services/vote/voteServices";
import { sendError, sendSuccess } from "../../utils/responseHandler";

export const castVote = async (req: Request, res: Response) => {
  try {
    const { candidateId, secretKeyHash } = req.body;
    if (!candidateId) {
      const errorMessage =
        "The following fields are required:" + !candidateId ? " Candidte" : "";
      sendError(res, 400, { message: errorMessage });
      return;
    }

    if (!secretKeyHash) {
      sendError(res, 400, {
        message: "Incomplete Request. Please contact system administrator",
      });
      return;
    }

    // Check if voter exists and hasn't voted
    const hasVoted: boolean = await hasVoterVoted(secretKeyHash);

    if (hasVoted) {
      sendError(res, 400, { message: messages.vote.voterHasAlreadyVoted });
      return;
    }

    // Check if candidate exists
    const candidates = await getAllCandidates();

    const candidate = candidates.find((entry) => entry.id === candidateId);

    if (!candidate) {
      sendError(res, 400, { message: messages.vote.candidateDoesNotExist });
      return;
    }

    if (!candidate.electionId || !candidate.partyId || !candidate.id) {
      sendError(res, 400, {
        message: messages.vote.invalidCandidateDetails,
      });
      return;
    }

    const voteRecord: voteRecordType = {
      voterSecretKeyHash: secretKeyHash,
      hasVoted: false,
      candidateId: candidate.id,
      electionId: candidate.electionId,
      partyId: candidate.partyId,
      votedAt: new Date(),
    };

    const currentEncryptedResults: ElectionResultType[] =
      await generateCurrentEncryptedResults(candidates);

    const newEnncryptedResults = homomorphicEncryption(
      currentEncryptedResults,
      candidateId
    );

    await castVoteWithBlockchian(voteRecord);
    await storeEncryptedRecordInBlockchian(newEnncryptedResults);

    sendSuccess(res, 201, {
      message: messages.vote.voteCastedSuccessfully,
      data: { secretKeyHash: secretKeyHash },
    });
  } catch (error) {
    console.error("Error casting vote:", error);
    sendError(res, 500, { message: messages.common.internalServerError });
  }
};

// Tally and decrypt votes for a candidate
// export const tallyVotes = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   (async () => {
//     try {
//       const candidateId = req.params.candidateId;
//       if (!candidateId)
//         return res.status(400).json({ error: "Candidate ID required" });
//       if (!fs.existsSync(ENCRYPTED_VOTES_FILE))
//         return res.status(404).json({ error: "No votes found" });
//       const data: Record<string, string[]> = JSON.parse(
//         fs.readFileSync(ENCRYPTED_VOTES_FILE, "utf-8")
//       );
//       const encryptedVotes = data[candidateId];
//       if (!encryptedVotes || encryptedVotes.length === 0)
//         return res.status(404).json({ error: "No votes for this candidate" });
//       const { publicKey, privateKey } = loadPaillierKeysFromEnv();
//       // Homomorphically add all encrypted votes
//       let encryptedSum = BigInt(encryptedVotes[0]);
//       for (let i = 1; i < encryptedVotes.length; i++) {
//         encryptedSum = publicKey.addition(
//           encryptedSum,
//           BigInt(encryptedVotes[i])
//         );
//       }
//       // Decrypt the sum
//       const tally = privateKey.decrypt(encryptedSum);
//       res.status(200).json({
//         candidateId,
//         encryptedSum: encryptedSum.toString(),
//         decryptedTally: tally.toString(),
//       });
//     } catch (error) {
//       console.error("Tally votes error:", error);
//       res.status(500).json({ error: "Tally votes failed" });
//     }
//   })();
// };
