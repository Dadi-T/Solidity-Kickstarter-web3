pragma solidity ^0.4.17;

contract Factory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getAllCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recepient;
        bool complete;
        mapping(address => bool) approvals;
        uint32 approvalCount;
    }

    modifier restrictedToManager() {
        require(msg.sender == manager);
        _;
    }

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint32 public approversCount;

    function Campaign(uint256 minimum, address sender) public {
        manager = sender;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(
            msg.value >= minimumContribution && approvers[msg.sender] == false
        );

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string description,
        uint256 value,
        address recepient
    ) public restrictedToManager {
        Request memory req = Request({
            description: description,
            value: value,
            recepient: recepient,
            complete: false,
            approvalCount: 0
        });

        requests.push(req);
    }

    function approveRequest(uint16 index) public {
        /* if he is a contributer and he haven't already voted */
        Request storage requestToVoteFor = requests[index];
        require(
            approvers[msg.sender] && requestToVoteFor.approvals[index] == false
        );
        requestToVoteFor.approvals[index] = true;
        requests[index].approvalCount++;
    }

    function finalizeRequest(uint16 index) public restrictedToManager {
        Request storage requestToFinalize = requests[index];
        require(requestToFinalize.approvalCount > (approversCount / 2));
        require(requestToFinalize.complete == false);
        requestToFinalize.recepient.transfer(this.balance);
        requestToFinalize.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint32,
            address
        )
    {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint256) {
        return requests.length;
    }
}
