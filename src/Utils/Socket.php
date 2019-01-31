<?php
	namespace App\Utils;

	use App\Exceptions\NetworkException;

	define('RCVBUFF',655360);

	class Socket {
		private $socket=null;
		private $conn;

		public function __construct($ip,$port) {
			$this->socket = socket_create(AF_INET, SOCK_STREAM, 0); 
			if ($this->socket === false)
				 throw new NetworkException("ERROR: Network Error: ".socket_strerror(socket_last_error()));
			$this->conn = socket_connect($this->socket, gethostbyname($ip), $port);
			if ($this->conn === false)
				 throw new NetworkException("ERROR: Connection Error: ".socket_strerror(socket_last_error()));
		}

		public function send($info) { 
			if( ! socket_send ( $this->socket , $info , strlen($info) , 0)) {
				throw new NetworkException("ERROR: Send Error: ".socket_strerror(socket_last_error()));
			}
		}


	/*public function receive() {
		$fullResult = '';
		$ret=socket_recv($this->socket, $message, RCVBUFF,0);
		while($ret !==false) {
			if (($ret===0)&&(socket_last_error()!=0)) throw new NetworkException("ERROR: Receive Error - ".socket_strerror(socket_last_error()));
			if ($message != null)	$fullResult .= $message;
			$ret=socket_recv($this->socket, $message, RCVBUFF,0);
		};
		if ($fullResult=='') throw NetworkException("ERROR: No Data");
		return $fullResult;
	} */

	public function receive($full=0) {
		$buf=0;
		$flag=0; $lenbuf=RCVBUFF;
		if ($full!=0) {
			$lenbuf=(int)$full; 
			$flag=MSG_WAITALL;
		}
		$r=socket_recv( $this->socket , $buf , $lenbuf , $flag  );
		if ($r === FALSE) {
			throw new NetworkException("ERROR: No Data");
		} else if ( $r === 0) {
			throw new NetworkException("ERROR: Receive Error - ".socket_strerror(socket_last_error()));
		}
		return $buf;
	}

		public function close() {
			if ($this->socket!=null) {	
				socket_close($this->socket);
				$this->socket=null;
			}
		}

		public function __destruct () {
			$this->close();
		}
	}
?>
