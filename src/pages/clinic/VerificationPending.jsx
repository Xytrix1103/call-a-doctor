import {useAuth} from "../../components/AuthCtx.jsx";
import {useEffect, useState} from "react";
import {equalTo, onValue, orderByChild, query, ref} from "firebase/database";
import {db} from "../../../api/firebase.js";

const VerificationPending = () => {
	const {user, loading} = useAuth();
	const [clinic, setClinic] = useState(null);
	
	useEffect(() => {
		console.log("VerificationPending");
		console.log(user, loading);
		
		onValue(query(ref(db, `clinic_requests`), orderByChild('admin'), equalTo(user.uid)), (snapshot) => {
			const clinic_requests = [];
			snapshot.forEach((reqSnapshot) => {
				clinic_requests.push({
					id: reqSnapshot.key,
					...reqSnapshot.val(),
				});
			});
			setClinic(clinic_requests[0]);
		});
	}, []);
	
	return (
		<div>
			<h1>Verification Pending</h1>
			{
				clinic ?
					(
						<>
							<p>{clinic.name}</p>
							<p>{clinic.address}</p>
							<p>{clinic.phone}</p>
							<p>{clinic.email}</p>
							<p>{clinic.admin}</p>
							<p>{clinic.image}</p>
							<p>{clinic.placeId}</p>
							{
								clinic.rejected ?
									(
										<p>Rejected</p>
									) :
									(
										<p>Pending</p>
									)
							}
						</>
					) :
					(
						<p>No Clinic</p>
					)
			}
		</div>
	);
}

export default VerificationPending;